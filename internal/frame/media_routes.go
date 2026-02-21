package frame

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) setupMediaRoutes() {
	s.router.GET("/api/media", s.handleGetMedia)
	s.router.POST("/api/media/delete", s.handleBulkDeleteMedia)
	s.router.POST("/api/media/restore", s.handleBulkRestoreMedia)
}

func (s *Server) handleGetMedia(ctx *gin.Context) {
	includeDeleted := ctx.DefaultQuery("includeDeleted", "false") == "true"

	s.cacheMutex.RLock()
	defer s.cacheMutex.RUnlock()

	media, err := s.loadMediaMetadata()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load media"})
		return
	}

	filteredMedia := make([]MediaItem, 0)
	for _, item := range media {
		if includeDeleted || !item.Deleted {
			filteredMedia = append(filteredMedia, item)
		}
	}

	ctx.JSON(http.StatusOK, filteredMedia)
}

func (s *Server) handleBulkDeleteMedia(ctx *gin.Context) {
	s.cacheMutex.Lock()
	defer s.cacheMutex.Unlock()

	var requestBody struct {
		IDs []string `json:"ids"`
	}

	if err := ctx.ShouldBindJSON(&requestBody); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if len(requestBody.IDs) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "No IDs provided"})
		return
	}

	media, err := s.loadMediaMetadata()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load media"})
		return
	}

	idsToDelete := make(map[string]bool)
	for _, id := range requestBody.IDs {
		idsToDelete[id] = true
	}

	deletedCount := 0
	for i := range media {
		if idsToDelete[media[i].ID] {
			media[i].Deleted = true
			deletedCount++
		}
	}

	if deletedCount == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "No matching media found"})
		return
	}

	if err := s.saveMediaMetadata(media); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save metadata"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Media deleted successfully",
		"deleted": deletedCount,
	})
}

func (s *Server) handleBulkRestoreMedia(ctx *gin.Context) {
	s.cacheMutex.Lock()
	defer s.cacheMutex.Unlock()

	var requestBody struct {
		IDs []string `json:"ids"`
	}

	if err := ctx.ShouldBindJSON(&requestBody); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if len(requestBody.IDs) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "No IDs provided"})
		return
	}

	media, err := s.loadMediaMetadata()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load media"})
		return
	}

	idsToRestore := make(map[string]bool)
	for _, id := range requestBody.IDs {
		idsToRestore[id] = true
	}

	restoredCount := 0
	for i := range media {
		if idsToRestore[media[i].ID] {
			media[i].Deleted = false
			restoredCount++
		}
	}

	if restoredCount == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "No matching media found"})
		return
	}

	if err := s.saveMediaMetadata(media); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save metadata"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":  "Media restored successfully",
		"restored": restoredCount,
	})
}
