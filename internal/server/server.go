package server

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
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

type Server struct {
	dataDir string
	router  *gin.Engine
	fs      fs.FS
}

type MediaItem struct {
	ID        string    `json:"id"`
	FrameID   string    `json:"frame_id"`
	Type      string    `json:"type"` // "image", "video", "text"
	Filename  string    `json:"filename,omitempty"`
	Content   string    `json:"content,omitempty"` // for text content
	CreatedAt time.Time `json:"created_at"`
}

func NewServer(fs fs.FS) *Server {
	return &Server{
		dataDir: "data",
		router:  gin.Default(),
		fs:      fs,
	}
}

func (s *Server) Start(port int) error {
	// Ensure data directory exists
	if err := os.MkdirAll(s.dataDir, 0755); err != nil {
		return fmt.Errorf("failed to create data directory: %v", err)
	}

	s.setupRoutes()
	return s.router.Run(fmt.Sprintf(":%d", port))
}

func (s *Server) setupRoutes() {
	// Setup templates
	// tmpl := template.Must(template.New("").ParseFS(s.fs, "*.html"))
	tmpl := template.Must(template.New("").ParseFiles("/home/mike/Work/gift-picture-frame/internal/ui/server-ui/build/client/index.html"))
	s.router.SetHTMLTemplate(tmpl)

	s.router.Use(cors.Default())
	s.router.Use(gzip.Gzip(gzip.DefaultCompression))
	s.router.Use(func(ctx *gin.Context) {
		ctx.Request.Body = http.MaxBytesReader(ctx.Writer, ctx.Request.Body, 10<<20)
		ctx.Next()
	})

	// Upload UI route
	s.router.GET("/:id", s.handleUploadUI)

	// Upload endpoint
	s.router.POST("/:id/upload", s.handleUpload)

	// Media retrieval endpoint
	s.router.GET("/:id/media", s.handleGetMedia)

	// Serve static files
	s.router.NoRoute(static.Serve("/", static.LocalFile("/home/mike/Work/gift-picture-frame/internal/ui/server-ui/build/client", false)))

	// Serve uploaded files
	s.router.Static("/files", s.dataDir)
}

func (s *Server) handleUploadUI(c *gin.Context) {
	// frameID := c.Param("id")
	// c.HTML(http.StatusOK, "index.html", gin.H{
	// 	"FrameID": frameID,
	// })

	// c.File("/path/to/index.html") // sends file verbatim, comments preserved

	b, err := os.ReadFile("/home/mike/Work/gift-picture-frame/internal/ui/server-ui/build/client/index.html")
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	// id := c.Param("id")
	b = bytes.ReplaceAll(b, []byte("__APP_IS_EMBEDDED__"), []byte("true"))

	c.Data(http.StatusOK, "text/html; charset=utf-8", b) // exact markup preserved
}

func (s *Server) handleUpload(c *gin.Context) {
	frameID := c.Param("id")

	// Create frame directory if it doesn't exist
	frameDir := filepath.Join(s.dataDir, frameID)
	if err := os.MkdirAll(frameDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create frame directory"})
		return
	}

	// Handle text content
	if textContent := c.PostForm("text"); textContent != "" {
		media := MediaItem{
			ID:        fmt.Sprintf("%d", time.Now().UnixNano()),
			FrameID:   frameID,
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
	defer file.Close()

	// Determine media type
	mediaType := "image"
	ext := strings.ToLower(filepath.Ext(header.Filename))
	if ext == ".mp4" || ext == ".avi" || ext == ".mov" || ext == ".webm" {
		mediaType = "video"
	}

	// Generate unique filename
	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), header.Filename)
	filePath := filepath.Join(frameDir, filename)

	// Save file
	dst, err := os.Create(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Save metadata
	media := MediaItem{
		ID:        fmt.Sprintf("%d", time.Now().UnixNano()),
		FrameID:   frameID,
		Type:      mediaType,
		Filename:  filename,
		CreatedAt: time.Now(),
	}

	if err := s.saveMediaMetadata(frameDir, media); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save metadata"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully", "id": media.ID})
}

func (s *Server) handleGetMedia(c *gin.Context) {
	frameID := c.Param("id")
	frameDir := filepath.Join(s.dataDir, frameID)

	media, err := s.loadMediaMetadata(frameDir)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load media"})
		return
	}

	c.JSON(http.StatusOK, media)
}

func (s *Server) saveMediaMetadata(frameDir string, media MediaItem) error {
	metadataFile := filepath.Join(frameDir, "metadata.json")

	// Load existing metadata
	var mediaList []MediaItem
	if data, err := os.ReadFile(metadataFile); err == nil {
		json.Unmarshal(data, &mediaList)
	}

	// Add new media item
	mediaList = append(mediaList, media)

	// Save updated metadata
	data, err := json.MarshalIndent(mediaList, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(metadataFile, data, 0644)
}

func (s *Server) loadMediaMetadata(frameDir string) ([]MediaItem, error) {
	metadataFile := filepath.Join(frameDir, "metadata.json")

	data, err := os.ReadFile(metadataFile)
	if err != nil {
		if os.IsNotExist(err) {
			return []MediaItem{}, nil // Return empty slice if no metadata file exists
		}
		return nil, err
	}

	var media []MediaItem
	if err := json.Unmarshal(data, &media); err != nil {
		return nil, err
	}

	return media, nil
}
