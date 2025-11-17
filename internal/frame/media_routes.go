package frame

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func (s *Server) setupMediaRoutes() {
	s.router.GET("/api/media", s.handleGetMedia)
}

func (s *Server) handleGetMedia(ctx *gin.Context) {
	s.cacheMutex.RLock()
	defer s.cacheMutex.RUnlock()

	// Simply read and return the local metadata file
	media, err := s.loadMediaMetadata()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load media"})
		return
	}

	ctx.JSON(http.StatusOK, media)
}
