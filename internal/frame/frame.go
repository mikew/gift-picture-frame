package frame

import (
	"bytes"
	"fmt"
	"html/template"
	"io/fs"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"picture-frame/internal/ui"
	"sync"
	"time"

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

type Server struct {
	frameID              string
	serverURL            string
	accessKey            string
	port                 int
	router               *gin.Engine
	fs                   fs.FS
	cacheDir             string
	metadataFile         string
	lastFetchedFile      string
	settingsFile         string
	settings             *Settings
	cacheMutex           sync.RWMutex
	brightnessController BrightnessController
	outputRotator        OutputRotator
	wifiManager          WifiManager
}

func NewServer(frameID string, serverURL string, port int, accessKey string, fs fs.FS, brightnessController BrightnessController, outputRotator OutputRotator, wifiManager WifiManager) *Server {
	cacheDir := filepath.Join("cache", frameID)

	return &Server{
		frameID:              frameID,
		serverURL:            serverURL,
		accessKey:            accessKey,
		port:                 port,
		router:               gin.Default(),
		fs:                   fs,
		cacheDir:             cacheDir,
		metadataFile:         filepath.Join(cacheDir, "metadata.json"),
		lastFetchedFile:      filepath.Join(cacheDir, "lastFetched.txt"),
		settingsFile:         filepath.Join(cacheDir, "settings.json"),
		brightnessController: brightnessController,
		outputRotator:        outputRotator,
		wifiManager:          wifiManager,
	}
}

func (s *Server) Start() error {
	if err := os.MkdirAll(s.cacheDir, 0755); err != nil {
		return fmt.Errorf("failed to create cache directory: %v", err)
	}

	settings, err := loadSettings(s.settingsFile)
	if err != nil {
		return fmt.Errorf("failed to load settings: %v", err)
	}
	s.settings = settings
	s.restoreSettings()

	s.setupRoutes()

	go s.syncMediaPeriodically()
	go s.launchKioskMode()

	return s.router.Run(fmt.Sprintf(":%d", s.port))
}

func (s *Server) setupRoutes() {
	tmpl := template.Must(template.New("").ParseFS(s.fs, "*.html"))
	s.router.SetHTMLTemplate(tmpl)

	s.router.Use(cors.Default())

	s.setupRotationRoutes()
	s.setupMediaRoutes()
	s.setupBrightnessRoutes()
	s.setupSettingsRoutes()
	s.setupWifiRoutes()

	s.router.GET("/", s.handleFrameDisplay)

	s.router.POST("/api/ready", s.handleFrameReady)

	s.router.NoRoute(
		static.Serve("/", ui.StaticLocalFS{http.FS(s.fs)}),
		static.Serve("/files", static.LocalFile(s.cacheDir, true)),
	)
}

func (s *Server) handleFrameDisplay(ctx *gin.Context) {
	b, err := fs.ReadFile(s.fs, "index.html")
	if err != nil {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	b = bytes.ReplaceAll(b, []byte("__APP_IS_EMBEDDED__"), []byte("true"))

	ctx.Data(http.StatusOK, "text/html; charset=utf-8", b)
}

func (s *Server) handleFrameReady(ctx *gin.Context) {
	// plymouthQuitCmd := exec.Command("plymouth", "quit")
	// if err := plymouthQuitCmd.Run(); err != nil {
	// 	fmt.Printf("Failed to run 'plymouth quit': %v\n", err)
	// }

	ctx.Status(http.StatusOK)
}

func (s *Server) launchKioskMode() error {
	url := fmt.Sprintf("http://localhost:%d", s.port)

	cmd := exec.Command("chromium", "--kiosk", "--noerrdialogs", "--disable-infobars", "--disable-session-crashed-bubble", url)
	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to launch kiosk mode: %v", err)
	}

	return nil
}
