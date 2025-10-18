package client

import (
	"fmt"
	"net/http"
	"os/exec"
	"path/filepath"
	"runtime"

	"github.com/gin-gonic/gin"
)

type Client struct {
	frameID   string
	serverURL string
	port      string
	router    *gin.Engine
}

func NewClient(frameID, serverURL, port string) *Client {
	return &Client{
		frameID:   frameID,
		serverURL: serverURL,
		port:      port,
		router:    gin.Default(),
	}
}

func (c *Client) Start() error {
	c.setupRoutes()
	
	// Start the local server in a goroutine
	go func() {
		if err := c.router.Run(":" + c.port); err != nil {
			fmt.Printf("Failed to start client server: %v\n", err)
		}
	}()

	// Launch Chromium in kiosk mode
	return c.launchKioskMode()
}

func (c *Client) setupRoutes() {
	// Serve static files for the picture frame display
	c.router.Static("/static", "./web/static")
	c.router.LoadHTMLGlob("web/templates/*")

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
	url := fmt.Sprintf("http://localhost:%s", c.port)
	
	var cmd *exec.Cmd
	
	switch runtime.GOOS {
	case "linux":
		// Try different browser options
		browsers := []string{
			"chromium-browser",
			"google-chrome",
			"chromium",
			"firefox",
		}
		
		var browserPath string
		for _, browser := range browsers {
			if path, err := exec.LookPath(browser); err == nil {
				browserPath = path
				break
			}
		}
		
		if browserPath == "" {
			return fmt.Errorf("no suitable browser found. Please install chromium-browser, google-chrome, or firefox")
		}
		
		if filepath.Base(browserPath) == "firefox" {
			cmd = exec.Command(browserPath, "--kiosk", url)
		} else {
			cmd = exec.Command(browserPath, 
				"--kiosk", 
				"--no-first-run",
				"--disable-infobars",
				"--disable-session-crashed-bubble",
				"--disable-translate",
				"--disable-features=TranslateUI",
				"--disable-ipc-flooding-protection",
				url)
		}
		
	case "darwin":
		// macOS
		cmd = exec.Command("open", "-a", "Google Chrome", "--args", "--kiosk", url)
		
	case "windows":
		// Windows
		cmd = exec.Command("cmd", "/c", "start", "chrome", "--kiosk", url)
		
	default:
		return fmt.Errorf("unsupported operating system: %s", runtime.GOOS)
	}

	fmt.Printf("Launching browser in kiosk mode: %s\n", url)
	return cmd.Start()
}