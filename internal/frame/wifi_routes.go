package frame

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) setupWifiRoutes() {
	s.router.GET("/api/wifi/scan", s.handleWifiScan)
	s.router.POST("/api/wifi/connect", s.handleWifiConnect)
}

func (s *Server) handleWifiScan(ctx *gin.Context) {
	if s.wifiManager == nil {
		ctx.JSON(http.StatusServiceUnavailable, gin.H{"error": "WiFi management not available"})
		return
	}

	networks, err := s.wifiManager.ScanForNetworks()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to scan for networks: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"networks": networks})
}

type wifiConnectRequest struct {
	SSID     string `json:"ssid" binding:"required"`
	Password string `json:"password"`
}

func (s *Server) handleWifiConnect(ctx *gin.Context) {
	if s.wifiManager == nil {
		ctx.JSON(http.StatusServiceUnavailable, gin.H{"error": "WiFi management not available"})
		return
	}

	var req wifiConnectRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid request: %v", err)})
		return
	}

	if err := s.wifiManager.Connect(req.SSID, req.Password); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to connect: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Successfully connected to " + req.SSID})
}
