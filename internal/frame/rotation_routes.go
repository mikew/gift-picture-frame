package frame

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) setupRotationRoutes() {
	s.router.POST("/api/rotate", s.handleRotateOutput)
}

func (s *Server) handleRotateOutput(ctx *gin.Context) {
	if s.outputRotator == nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Rotation control not available"})
		return
	}

	var req struct {
		Direction string `json:"direction"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if req.Direction != "clockwise" && req.Direction != "counterclockwise" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Direction must be 'clockwise' or 'counterclockwise'"})
		return
	}

	degrees := 90
	if req.Direction == "counterclockwise" {
		degrees = -90
	}

	newRotation := (s.settings.Rotation + degrees + 360) % 360
	if err := s.outputRotator.SetRotation(newRotation); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to rotate output: %v", err)})
		return
	}

	s.settings.Rotation = newRotation

	if err := saveSettings(s.settings, s.settingsFile); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to save settings: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{})
}
