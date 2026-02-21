package uploader

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"slices"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"picture-frame/internal/ui"
)

type Server struct {
	dataDir     string
	router      *gin.Engine
	fs          fs.FS
	knownFrames []FrameConfig
	metadataMu  sync.RWMutex
}

type MediaItem struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"`
	Filename  string    `json:"filename,omitempty"`
	Content   string    `json:"content,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

type FrameConfig struct {
	Name        string   `json:"name"`
	AllowedKeys []string `json:"allowed_keys"`
}

type FramesConfig struct {
	KnownFrames []FrameConfig `json:"known_frames"`
}

type FrameInfo struct {
	Name string `json:"name"`
}

func NewServer(fs fs.FS) *Server {
	return &Server{
		dataDir: "data",
		router:  gin.Default(),
		fs:      fs,
	}
}

func (s *Server) Start(port int) error {
	if err := os.MkdirAll(s.dataDir, 0755); err != nil {
		return fmt.Errorf("failed to create data directory: %v", err)
	}

	if err := s.loadFramesConfig(); err != nil {
		return fmt.Errorf("failed to load frames config: %v", err)
	}

	s.setupRoutes()
	return s.router.Run(fmt.Sprintf(":%d", port))
}

func (s *Server) setupRoutes() {
	tmpl := template.Must(template.New("").ParseFS(s.fs, "*.html"))
	s.router.SetHTMLTemplate(tmpl)

	s.router.Use(cors.Default())
	s.router.Use(gzip.Gzip(gzip.DefaultCompression))
	s.router.Use(func(ctx *gin.Context) {
		ctx.Request.Body = http.MaxBytesReader(ctx.Writer, ctx.Request.Body, 500<<20)
		ctx.Next()
	})

	s.router.GET("/frames", s.handleListFrames)

	s.router.GET("/:id", s.handleUploadUI)
	s.router.GET("/", s.handleUploadUI)

	s.router.POST("/:id/upload", s.handleUpload)

	s.router.GET("/:id/media", s.handleGetMedia)

	s.router.NoRoute(
		static.Serve("/", ui.StaticLocalFS{http.FS(s.fs)}),
		static.Serve("/files", static.LocalFile(s.dataDir, true)),
	)
}

func (s *Server) handleUploadUI(c *gin.Context) {
	id := c.Param("id")

	if id != "" && !s.isFrameAllowed(id) {
		c.String(http.StatusForbidden, "Frame ID not allowed")
		return
	}

	htmlFilePath := "index.html"
	if id != "" {
		htmlFilePath = "id.html"
	}

	b, err := fs.ReadFile(s.fs, htmlFilePath)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	b = bytes.ReplaceAll(b, []byte("__APP_IS_EMBEDDED__"), []byte("true"))

	c.Data(http.StatusOK, "text/html; charset=utf-8", b)
}

func (s *Server) handleListFrames(c *gin.Context) {
	frames := make([]FrameInfo, 0, len(s.knownFrames))

	for _, config := range s.knownFrames {
		frames = append(frames, FrameInfo{
			Name: config.Name,
		})
	}

	c.JSON(http.StatusOK, frames)
}

func (s *Server) handleUpload(c *gin.Context) {
	frameID := c.Param("id")

	if !s.isFrameAllowed(frameID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Frame ID not allowed"})
		return
	}

	frameDir := filepath.Join(s.dataDir, frameID)
	if err := os.MkdirAll(frameDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create frame directory"})
		return
	}

	// Handle text content
	if textContent := c.PostForm("text"); textContent != "" {
		media := MediaItem{
			ID:        uuid.New().String(),
			Type:      "text",
			Content:   textContent,
			CreatedAt: time.Now(),
		}

		if err := s.saveMediaMetadata(frameDir, media); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save text"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Text uploaded successfully", "id": media.ID})
		return
	}

	// Handle file upload
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	processor := GetMediaProcessor(header.Filename)
	if processor == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported file type"})
		return
	}

	mediaId := uuid.New().String()

	go func() {
		defer file.Close()

		originalExt := filepath.Ext(header.Filename)
		tempUploadFile, err := os.CreateTemp("", "upload-*"+originalExt)
		if err != nil {
			fmt.Printf("Failed to create temp file: %v", err)
			return
		}
		tempUploadPath := tempUploadFile.Name()
		defer os.Remove(tempUploadPath)

		if _, err := io.Copy(tempUploadFile, file); err != nil {
			tempUploadFile.Close()
			fmt.Printf("Failed to save file: %v", err)
			return
		}
		tempUploadFile.Close()

		processedPath, err := processor.Process(tempUploadPath)
		if err != nil {
			fmt.Printf("Failed to process file: %v", err)
			return
		}
		defer os.Remove(processedPath)

		processedExt := filepath.Ext(processedPath)
		finalFilename := mediaId + processedExt
		finalFilePath := filepath.Join(frameDir, finalFilename)

		if err := os.Rename(processedPath, finalFilePath); err != nil {
			srcFile, err := os.Open(processedPath)
			if err != nil {
				fmt.Printf("Failed to save processed file: %v", err)
				return
			}
			defer srcFile.Close()

			dstFile, err := os.Create(finalFilePath)
			if err != nil {
				fmt.Printf("Failed to save processed file: %v", err)
				return
			}
			defer dstFile.Close()

			if _, err := io.Copy(dstFile, srcFile); err != nil {
				os.Remove(finalFilePath)
				fmt.Printf("Failed to save processed file: %v", err)
				return
			}
		}

		mediaType := DetermineMediaType(finalFilename)

		media := MediaItem{
			ID:        mediaId,
			Type:      mediaType,
			Filename:  finalFilename,
			CreatedAt: time.Now(),
		}

		if err := s.saveMediaMetadata(frameDir, media); err != nil {
			os.Remove(finalFilePath)
			fmt.Printf("Failed to save metadata: %v", err)
			return
		}
	}()

	c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully", "id": mediaId})
}

func (s *Server) handleGetMedia(c *gin.Context) {
	frameID := c.Param("id")

	accessKey := c.GetHeader("Authorization")
	if accessKey == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
		return
	}

	if !s.validateAccessKey(frameID, accessKey) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Invalid access key for this frame"})
		return
	}

	frameDir := filepath.Join(s.dataDir, frameID)

	media, err := s.loadMediaMetadata(frameDir)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load media"})
		return
	}

	if sinceStr := c.Query("since"); sinceStr != "" {
		since, err := time.Parse(time.RFC3339, sinceStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid 'since' timestamp format. Use RFC3339 format."})
			return
		}

		filteredMedia := make([]MediaItem, 0)
		for _, item := range media {
			if item.CreatedAt.After(since) {
				filteredMedia = append(filteredMedia, item)
			}
		}
		media = filteredMedia
	}

	c.JSON(http.StatusOK, media)
}

func (s *Server) saveMediaMetadata(frameDir string, media MediaItem) error {
	s.metadataMu.Lock()
	defer s.metadataMu.Unlock()

	metadataFile := filepath.Join(frameDir, "metadata.json")

	var mediaList []MediaItem
	if data, err := os.ReadFile(metadataFile); err == nil {
		json.Unmarshal(data, &mediaList)
	}

	mediaList = append(mediaList, media)

	data, err := json.MarshalIndent(mediaList, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(metadataFile, data, 0644)
}

func (s *Server) loadMediaMetadata(frameDir string) ([]MediaItem, error) {
	s.metadataMu.RLock()
	defer s.metadataMu.RUnlock()

	metadataFile := filepath.Join(frameDir, "metadata.json")

	data, err := os.ReadFile(metadataFile)
	if err != nil {
		if os.IsNotExist(err) {
			return []MediaItem{}, nil
		}
		return nil, err
	}

	var media []MediaItem
	if err := json.Unmarshal(data, &media); err != nil {
		return nil, err
	}

	return media, nil
}

func (s *Server) loadFramesConfig() error {
	configFile := "frames.json"

	data, err := os.ReadFile(configFile)
	if err != nil {
		if os.IsNotExist(err) {
			s.knownFrames = []FrameConfig{}
			return nil
		}
		return fmt.Errorf("failed to read frames.json: %v", err)
	}

	var config FramesConfig
	if err := json.Unmarshal(data, &config); err != nil {
		return fmt.Errorf("failed to parse frames.json: %v", err)
	}

	s.knownFrames = config.KnownFrames

	return nil
}

func (s *Server) findFrame(name string) *FrameConfig {
	for _, frame := range s.knownFrames {
		if frame.Name == name {
			return &frame
		}
	}

	return nil
}

func (s *Server) validateAccessKey(frameID, accessKey string) bool {
	frameConfig := s.findFrame(frameID)
	if frameConfig == nil {
		return false
	}

	return slices.Contains(frameConfig.AllowedKeys, accessKey)
}

func (s *Server) isFrameAllowed(frameID string) bool {
	frameConfig := s.findFrame(frameID)
	return frameConfig != nil
}
