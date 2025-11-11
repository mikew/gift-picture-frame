package frame

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"picture-frame/internal/ui"
	"sync"
	"time"

	// "os/exec"
	// "runtime"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

type MediaItem struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"`
	Filename  string    `json:"filename,omitempty"`
	Content   string    `json:"content,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

type Client struct {
	frameID         string
	serverURL       string
	port            int
	router          *gin.Engine
	fs              fs.FS
	cacheDir        string
	metadataFile    string
	lastFetchedFile string
	cacheMutex      sync.RWMutex
}

func NewClient(frameID string, serverURL string, port int, fs fs.FS) *Client {
	cacheDir := filepath.Join("cache", frameID)

	return &Client{
		frameID:         frameID,
		serverURL:       serverURL,
		port:            port,
		router:          gin.Default(),
		fs:              fs,
		cacheDir:        cacheDir,
		metadataFile:    filepath.Join(cacheDir, "metadata.json"),
		lastFetchedFile: filepath.Join(cacheDir, "lastFetched.txt"),
	}
}

func (c *Client) Start() error {
	// Ensure cache directory exists
	if err := os.MkdirAll(c.cacheDir, 0755); err != nil {
		return fmt.Errorf("failed to create cache directory: %v", err)
	}

	c.setupRoutes()

	// Start background media sync
	go c.syncMediaPeriodically()

	// Launch Chromium in kiosk mode
	go func() {
		c.launchKioskMode()
	}()

	return c.router.Run(fmt.Sprintf(":%d", c.port))
}

func (c *Client) setupRoutes() {
	// Setup templates
	tmpl := template.Must(template.New("").ParseFS(c.fs, "*.html"))
	c.router.SetHTMLTemplate(tmpl)

	c.router.Use(cors.Default())

	// Picture frame display route
	c.router.GET("/", c.handleFrameDisplay)

	// API endpoint to get media from the main server
	c.router.GET("/api/media", c.handleGetMedia)

	// Serve cached media files (frame backend handles frame_id internally)
	c.router.GET("/files/:filename", c.handleServeMediaFile)

	// Serve static files
	c.router.NoRoute(static.Serve("/", ui.StaticLocalFS{http.FS(c.fs)}))
}

func (c *Client) handleFrameDisplay(ctx *gin.Context) {
	b, err := fs.ReadFile(c.fs, "index.html")
	if err != nil {
		ctx.Status(http.StatusInternalServerError)
		return
	}
	// id := c.Param("id")
	b = bytes.ReplaceAll(b, []byte("__APP_IS_EMBEDDED__"), []byte("true"))

	ctx.Data(http.StatusOK, "text/html; charset=utf-8", b) // exact markup preserved
}

func (c *Client) handleGetMedia(ctx *gin.Context) {
	c.cacheMutex.RLock()
	defer c.cacheMutex.RUnlock()

	// Simply read and return the local metadata file
	media, err := c.loadMediaMetadata()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load media"})
		return
	}

	ctx.JSON(http.StatusOK, media)
}

func (c *Client) handleServeMediaFile(ctx *gin.Context) {
	filename := ctx.Param("filename")

	// Build path to cached file (frame backend knows its own frame_id)
	filePath := filepath.Join(c.cacheDir, c.frameID, filename)

	// Serve the file
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	ctx.File(filePath)
}

func (c *Client) downloadMediaFile(item MediaItem) error {
	// Build URL to uploader server's file endpoint
	fileURL := fmt.Sprintf("%s/files/%s/%s", c.serverURL, c.frameID, item.Filename)

	// Fetch the file from uploader server
	resp, err := http.Get(fileURL)
	if err != nil {
		return fmt.Errorf("failed to fetch file from uploader: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("uploader returned status %d for file %s", resp.StatusCode, item.Filename)
	}

	// Create subdirectory for frame if needed
	frameDir := filepath.Join(c.cacheDir, c.frameID)
	if err := os.MkdirAll(frameDir, 0755); err != nil {
		return fmt.Errorf("failed to create frame cache directory: %v", err)
	}

	// Create destination file
	destPath := filepath.Join(frameDir, item.Filename)

	// Check if file already exists
	if _, err := os.Stat(destPath); err == nil {
		// File already exists, skip download
		return nil
	}

	destFile, err := os.Create(destPath)
	if err != nil {
		return fmt.Errorf("failed to create cache file: %v", err)
	}
	defer destFile.Close()

	// Copy the file content
	if _, err := io.Copy(destFile, resp.Body); err != nil {
		os.Remove(destPath) // Clean up partial file
		return fmt.Errorf("failed to write file to cache: %v", err)
	}

	return nil
}

func (c *Client) syncMediaPeriodically() {
	// Sync immediately on startup
	if err := c.syncMedia(); err != nil {
		fmt.Printf("Initial media sync failed: %v\n", err)
	}

	// Then sync every 30 seconds
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		if err := c.syncMedia(); err != nil {
			fmt.Printf("Media sync failed: %v\n", err)
		}
	}
}

func (c *Client) syncMedia() error {
	c.cacheMutex.Lock()
	defer c.cacheMutex.Unlock()

	// Load last fetched time
	lastFetched := c.loadLastFetched()

	// Build URL with 'since' parameter if we have a last fetched time
	mediaURL := fmt.Sprintf("%s/%s/media", c.serverURL, c.frameID)
	if !lastFetched.IsZero() {
		params := url.Values{}
		params.Add("since", lastFetched.Format(time.RFC3339))
		mediaURL = fmt.Sprintf("%s?%s", mediaURL, params.Encode())
	}

	// Fetch new/updated media from uploader server
	resp, err := http.Get(mediaURL)
	if err != nil {
		return fmt.Errorf("failed to fetch media from uploader: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("uploader returned status %d", resp.StatusCode)
	}

	// Parse the response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response: %v", err)
	}

	var newMedia []MediaItem
	if err := json.Unmarshal(body, &newMedia); err != nil {
		return fmt.Errorf("failed to parse media data: %v", err)
	}

	// Load existing media
	existingMedia, err := c.loadMediaMetadata()
	if err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to load existing metadata: %v", err)
	}

	// Create map of existing media by ID
	mediaMap := make(map[string]MediaItem)
	for _, item := range existingMedia {
		mediaMap[item.ID] = item
	}

	// Download and add new media items
	for _, item := range newMedia {
		// Download media file if it has a filename (images/videos)
		if item.Filename != "" {
			if err := c.downloadMediaFile(item); err != nil {
				fmt.Printf("Warning: Failed to download media file %s: %v\n", item.Filename, err)
				continue
			}
		}
		mediaMap[item.ID] = item
	}

	// Convert map back to slice
	updatedMedia := make([]MediaItem, 0, len(mediaMap))
	for _, item := range mediaMap {
		updatedMedia = append(updatedMedia, item)
	}

	// Save updated metadata
	if err := c.saveMediaMetadata(updatedMedia); err != nil {
		return fmt.Errorf("failed to save metadata: %v", err)
	}

	// Update last fetched timestamp
	if err := c.saveLastFetched(time.Now()); err != nil {
		return fmt.Errorf("failed to save last fetched time: %v", err)
	}

	return nil
}

func (c *Client) loadMediaMetadata() ([]MediaItem, error) {
	data, err := os.ReadFile(c.metadataFile)
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

func (c *Client) saveMediaMetadata(media []MediaItem) error {
	data, err := json.MarshalIndent(media, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(c.metadataFile, data, 0644)
}

func (c *Client) loadLastFetched() time.Time {
	data, err := os.ReadFile(c.lastFetchedFile)
	if err != nil {
		return time.Time{} // Return zero time if file doesn't exist
	}

	timestamp, err := time.Parse(time.RFC3339, string(data))
	if err != nil {
		return time.Time{}
	}

	return timestamp
}

func (c *Client) saveLastFetched(t time.Time) error {
	return os.WriteFile(c.lastFetchedFile, []byte(t.Format(time.RFC3339)), 0644)
}

func (c *Client) launchKioskMode() error {
	return nil
}

// func (c *Client) launchKioskMode() error {
// 	url := fmt.Sprintf("http://localhost:%d", c.port)

// 	var cmd *exec.Cmd

// 	switch runtime.GOOS {
// 	case "linux":
// 		// Try different browser options
// 		browsers := []string{
// 			"chromium-browser",
// 			"google-chrome",
// 			"chromium",
// 			"firefox",
// 		}

// 		var browserPath string
// 		for _, browser := range browsers {
// 			if path, err := exec.LookPath(browser); err == nil {
// 				browserPath = path
// 				break
// 			}
// 		}

// 		if browserPath == "" {
// 			return fmt.Errorf("no suitable browser found. Please install chromium-browser, google-chrome, or firefox")
// 		}

// 		if filepath.Base(browserPath) == "firefox" {
// 			cmd = exec.Command(browserPath, "--kiosk", url)
// 		} else {
// 			cmd = exec.Command(browserPath,
// 				"--kiosk",
// 				"--no-first-run",
// 				"--disable-infobars",
// 				"--disable-session-crashed-bubble",
// 				"--disable-translate",
// 				"--disable-features=TranslateUI",
// 				"--disable-ipc-flooding-protection",
// 				url)
// 		}

// 	case "darwin":
// 		// macOS
// 		cmd = exec.Command("open", "-a", "Google Chrome", "--args", "--kiosk", url)

// 	case "windows":
// 		// Windows
// 		cmd = exec.Command("cmd", "/c", "start", "chrome", "--kiosk", url)

// 	default:
// 		return fmt.Errorf("unsupported operating system: %s", runtime.GOOS)
// 	}

// 	fmt.Printf("Launching browser in kiosk mode: %s\n", url)
// 	return cmd.Start()
// }
