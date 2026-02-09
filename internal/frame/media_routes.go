package frame

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) setupMediaRoutes() {
	s.router.GET("/api/media", s.handleGetMedia)
	s.router.DELETE("/api/media/:id", s.handleDeleteMedia)
}

func (s *Server) handleGetMedia(ctx *gin.Context) {
	s.cacheMutex.RLock()
	defer s.cacheMutex.RUnlock()

	media, err := s.loadMediaMetadata()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load media"})
		return
	}

	// Filter out deleted items
	filteredMedia := make([]MediaItem, 0)
	for _, item := range media {
		if !item.Deleted {
			filteredMedia = append(filteredMedia, item)
		}
	}

	ctx.JSON(http.StatusOK, filteredMedia)
}

func (s *Server) handleDeleteMedia(ctx *gin.Context) {
	s.cacheMutex.Lock()
	defer s.cacheMutex.Unlock()

	mediaID := ctx.Param("id")
	if mediaID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Media ID is required"})
		return
	}

	media, err := s.loadMediaMetadata()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load media"})
		return
	}

	found := false
	for i := range media {
		if media[i].ID == mediaID {
			media[i].Deleted = true
			found = true
			break
		}
	}

	if !found {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Media not found"})
		return
	}

	if err := s.saveMediaMetadata(media); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save metadata"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Media deleted successfully"})
}
