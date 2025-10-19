package client

import (
	"embed"
	"fmt"
	"html/template"
	"net/http"
	// "os/exec"
	// "path/filepath"
	// "runtime"

	"github.com/gin-gonic/gin"
)

type Client struct {
	frameID       string
	serverURL     string
	port          int
	router        *gin.Engine
	embeddedFiles embed.FS
}

func NewClient(frameID string, serverURL string, port int, embeddedFiles embed.FS) *Client {
	return &Client{
		frameID:       frameID,
		serverURL:     serverURL,
		port:          port,
		router:        gin.Default(),
		embeddedFiles: embeddedFiles,
	}
}

func (c *Client) Start() error {
	c.setupRoutes()

	// Launch Chromium in kiosk mode
	go func() {
		c.launchKioskMode()
	}()

	return c.router.Run(fmt.Sprintf(":%d", c.port))
}

func (c *Client) setupRoutes() {
	// Setup embedded templates
	tmpl := template.Must(template.New("").ParseFS(c.embeddedFiles, "web/templates/*"))
	c.router.SetHTMLTemplate(tmpl)

	// Serve embedded static files
	c.router.StaticFS("/static", http.FS(c.embeddedFiles))

	// Picture frame display route
	c.router.GET("/", c.handleFrameDisplay)

	// API endpoint to get media from the main server
	c.router.GET("/api/media", c.handleGetMedia)
}

func (c *Client) handleFrameDisplay(ctx *gin.Context) {
	ctx.HTML(http.StatusOK, "frame.html", gin.H{
		"FrameID":   c.frameID,
		"ServerURL": c.serverURL,
	})
}

func (c *Client) handleGetMedia(ctx *gin.Context) {
	// Proxy request to the main server
	resp, err := http.Get(fmt.Sprintf("%s/%s/media", c.serverURL, c.frameID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch media"})
		return
	}
	defer resp.Body.Close()

	// Forward the response
	ctx.DataFromReader(resp.StatusCode, resp.ContentLength, resp.Header.Get("Content-Type"), resp.Body, nil)
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
