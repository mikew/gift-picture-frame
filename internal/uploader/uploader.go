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
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"picture-frame/internal/ui"
)

type Server struct {
	dataDir string
	router  *gin.Engine
	fs      fs.FS
}

type MediaItem struct {
	ID        string    `json:"id"`
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
	tmpl := template.Must(template.New("").ParseFS(s.fs, "*.html"))
	s.router.SetHTMLTemplate(tmpl)

	s.router.Use(cors.Default())
	s.router.Use(gzip.Gzip(gzip.DefaultCompression))
	s.router.Use(func(ctx *gin.Context) {
		ctx.Request.Body = http.MaxBytesReader(ctx.Writer, ctx.Request.Body, 500<<20)
		ctx.Next()
	})

	// Upload UI route
	s.router.GET("/:id", s.handleUploadUI)

	// Upload endpoint
	s.router.POST("/:id/upload", s.handleUpload)

	// Media retrieval endpoint
	s.router.GET("/:id/media", s.handleGetMedia)

	// Serve static files
	s.router.NoRoute(
		static.Serve("/", ui.StaticLocalFS{http.FS(s.fs)}),
		static.Serve("/files", static.LocalFile(s.dataDir, true)),
	)

	// Serve uploaded files
	// s.router.Use(static.Serve("/files", static.LocalFile(s.dataDir, true)))
	// s.router.Static("/files", s.dataDir)
}

func (s *Server) handleUploadUI(c *gin.Context) {
	b, err := fs.ReadFile(s.fs, "index.html")
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
	defer file.Close()

	// Get appropriate media processor
	processor := GetMediaProcessor(header.Filename)
	if processor == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported file type"})
		return
	}

	mediaId := uuid.New().String()

	go func() {
		// Save uploaded file to system temp location
		originalExt := filepath.Ext(header.Filename)
		tempUploadFile, err := os.CreateTemp("", "upload-*"+originalExt)
		if err != nil {
			fmt.Printf("Failed to create temp file: %v", err)
			// c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create temp file"})
			return
		}
		tempUploadPath := tempUploadFile.Name()
		defer os.Remove(tempUploadPath)

		if _, err := io.Copy(tempUploadFile, file); err != nil {
			tempUploadFile.Close()
			// c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			fmt.Printf("Failed to save file: %v", err)
			return
		}
		tempUploadFile.Close()

		// Process the file
		processedPath, err := processor.Process(tempUploadPath)
		if err != nil {
			// c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to process file: %v", err)})
			fmt.Printf("Failed to process file: %v", err)
			return
		}
		defer os.Remove(processedPath)

		// Generate unique ID and final filename
		processedExt := filepath.Ext(processedPath)
		finalFilename := mediaId + processedExt
		finalFilePath := filepath.Join(frameDir, finalFilename)

		// Move processed file to final destination
		if err := os.Rename(processedPath, finalFilePath); err != nil {
			// If rename fails (e.g., cross-device), copy the file
			srcFile, err := os.Open(processedPath)
			if err != nil {
				// c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save processed file"})
				fmt.Printf("Failed to save processed file: %v", err)
				return
			}
			defer srcFile.Close()

			dstFile, err := os.Create(finalFilePath)
			if err != nil {
				// c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save processed file"})
				fmt.Printf("Failed to save processed file: %v", err)
				return
			}
			defer dstFile.Close()

			if _, err := io.Copy(dstFile, srcFile); err != nil {
				os.Remove(finalFilePath)
				// c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save processed file"})
				fmt.Printf("Failed to save processed file: %v", err)
				return
			}
		}

		// Determine media type
		mediaType := DetermineMediaType(finalFilename)

		// Save metadata
		media := MediaItem{
			ID:        mediaId,
			Type:      mediaType,
			Filename:  finalFilename,
			CreatedAt: time.Now(),
		}

		if err := s.saveMediaMetadata(frameDir, media); err != nil {
			os.Remove(finalFilePath)
			// c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save metadata"})
			fmt.Printf("Failed to save metadata: %v", err)
			return
		}
	}()

	c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully", "id": mediaId})
}

func (s *Server) handleGetMedia(c *gin.Context) {
	frameID := c.Param("id")
	frameDir := filepath.Join(s.dataDir, frameID)

	media, err := s.loadMediaMetadata(frameDir)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load media"})
		return
	}

	// Filter by 'since' timestamp if provided
	if sinceStr := c.Query("since"); sinceStr != "" {
		since, err := time.Parse(time.RFC3339, sinceStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid 'since' timestamp format. Use RFC3339 format."})
			return
		}

		// Filter media items to only include those created after 'since'
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
