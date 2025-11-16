package frame

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"slices"
	"time"
)

func (s *Server) syncMediaPeriodically() {
	// Sync immediately on startup
	if err := s.syncMedia(); err != nil {
		fmt.Printf("Initial media sync failed: %v\n", err)
	}

	// Then sync every 30 seconds
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		if err := s.syncMedia(); err != nil {
			fmt.Printf("Media sync failed: %v\n", err)
		}
	}
}

func (s *Server) syncMedia() error {
	s.cacheMutex.Lock()
	defer s.cacheMutex.Unlock()

	// Load last fetched time
	lastFetched := s.loadLastFetched()

	// Build URL with 'since' parameter if we have a last fetched time
	mediaURL := fmt.Sprintf("%s/%s/media", s.serverURL, s.frameID)
	if !lastFetched.IsZero() {
		params := url.Values{}
		params.Add("since", lastFetched.UTC().Format(time.RFC3339))
		mediaURL = fmt.Sprintf("%s?%s", mediaURL, params.Encode())
	}

	// Fetch new/updated media from uploader server
	resp, err := http.Get(mediaURL)
	if err != nil {
		return fmt.Errorf("failed to fetch media from uploader: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("uploader returned status %d", resp.StatusCode)
	}

	// Parse the response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response: %v", err)
	}

	var newMedia []MediaItem
	if err := json.Unmarshal(body, &newMedia); err != nil {
		return fmt.Errorf("failed to parse media data: %v", err)
	}

	// Load existing media
	existingMedia, err := s.loadMediaMetadata()
	if err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to load existing metadata: %v", err)
	}

	// Create map of existing media by ID
	mediaMap := make(map[string]MediaItem)
	for _, item := range existingMedia {
		mediaMap[item.ID] = item
	}

	// Download and add new media items
	for _, item := range newMedia {
		// Download media file if it has a filename (images/videos)
		if item.Filename != "" {
			if err := s.downloadMediaFile(item); err != nil {
				fmt.Printf("Warning: Failed to download media file %s: %v\n", item.Filename, err)
				continue
			}
		}
		mediaMap[item.ID] = item
	}

	// Convert map back to slice
	updatedMedia := make([]MediaItem, 0, len(mediaMap))
	for _, item := range mediaMap {
		updatedMedia = append(updatedMedia, item)
	}

	// Sort by CreatedAt (optional)
	slices.SortFunc(updatedMedia, func(a, b MediaItem) int {
		return a.CreatedAt.Compare(b.CreatedAt)
	})

	// Save updated metadata
	if err := s.saveMediaMetadata(updatedMedia); err != nil {
		return fmt.Errorf("failed to save metadata: %v", err)
	}

	// Update last fetched timestamp
	if err := s.saveLastFetched(time.Now()); err != nil {
		return fmt.Errorf("failed to save last fetched time: %v", err)
	}

	return nil
}
