package frame

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) setupSettingsRoutes() {
	s.router.GET("/api/settings/restore", s.handleRestoreSettings)
}

func (s *Server) handleRestoreSettings(ctx *gin.Context) {
	if err := s.restoreSettings(); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to restore settings: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"settings": s.settings})
}
