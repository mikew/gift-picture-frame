package frame

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) setupBrightnessRoutes() {
	s.router.POST("/api/brightness/increase", s.handleIncreaseBrightness)
	s.router.POST("/api/brightness/decrease", s.handleDecreaseBrightness)
}

func (s *Server) modifyBrightness(direction int) error {
	if s.brightnessController == nil {
		return fmt.Errorf("brightness control not available")
	}

	current, err := s.brightnessController.GetBrightness()
	if err != nil {
		return fmt.Errorf("failed to get current brightness: %v", err)
	}

	max, err := s.brightnessController.GetMaxBrightness()
	if err != nil {
		return fmt.Errorf("failed to get max brightness: %v", err)
	}

	// Modify by percentage of max brightness
	step := max / 5
	if step < 1 {
		step = 1
	}
	newLevel := current + (direction * step)

	if err := s.brightnessController.SetBrightness(newLevel); err != nil {
		return err
	}

	s.settings.Brightness = newLevel
	if err := saveSettings(s.settings, s.settingsFile); err != nil {
		return fmt.Errorf("failed to save settings: %v", err)
	}

	return nil
}

func (s *Server) handleIncreaseBrightness(ctx *gin.Context) {
	if err := s.modifyBrightness(1); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to increase brightness: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{})
}

func (s *Server) handleDecreaseBrightness(ctx *gin.Context) {
	if err := s.modifyBrightness(-1); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to decrease brightness: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{})
}
