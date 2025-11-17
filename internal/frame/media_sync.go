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
	if err := s.syncMedia(); err != nil {
		fmt.Printf("Initial media sync failed: %v\n", err)
	}

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

	mediaURL := fmt.Sprintf("%s/%s/media", s.serverURL, s.frameID)

	lastFetched := s.loadLastFetched()
	if !lastFetched.IsZero() {
		params := url.Values{}
		params.Add("since", lastFetched.UTC().Format(time.RFC3339))
		mediaURL = fmt.Sprintf("%s?%s", mediaURL, params.Encode())
	}

	req, err := http.NewRequest("GET", mediaURL, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %v", err)
	}
	req.Header.Set("Authorization", s.accessKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to fetch media from uploader: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("uploader returned status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response: %v", err)
	}

	var newMedia []MediaItem
	if err := json.Unmarshal(body, &newMedia); err != nil {
		return fmt.Errorf("failed to parse media data: %v", err)
	}

	existingMedia, err := s.loadMediaMetadata()
	if err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to load existing metadata: %v", err)
	}

	mediaMap := make(map[string]MediaItem)
	for _, item := range existingMedia {
		mediaMap[item.ID] = item
	}

	for _, item := range newMedia {
		if item.Filename != "" {
			if err := s.downloadMediaFile(item); err != nil {
				fmt.Printf("Warning: Failed to download media file %s: %v\n", item.Filename, err)
				continue
			}
		}
		mediaMap[item.ID] = item
	}

	updatedMedia := make([]MediaItem, 0, len(mediaMap))
	for _, item := range mediaMap {
		updatedMedia = append(updatedMedia, item)
	}

	slices.SortFunc(updatedMedia, func(a, b MediaItem) int {
		return a.CreatedAt.Compare(b.CreatedAt)
	})

	if err := s.saveMediaMetadata(updatedMedia); err != nil {
		return fmt.Errorf("failed to save metadata: %v", err)
	}

	if err := s.saveLastFetched(time.Now()); err != nil {
		return fmt.Errorf("failed to save last fetched time: %v", err)
	}

	return nil
}
