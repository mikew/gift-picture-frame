package frame

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

func (s *Server) loadMediaMetadata() ([]MediaItem, error) {
	data, err := os.ReadFile(s.metadataFile)
	if err != nil {
		if os.IsNotExist(err) {
			return []MediaItem{}, nil
		}
		return nil, err
	}

	var media []MediaItem
	if err := json.Unmarshal(data, &media); err != nil {
		return nil, err
	}

	return media, nil
}

func (s *Server) saveMediaMetadata(media []MediaItem) error {
	data, err := json.MarshalIndent(media, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(s.metadataFile, data, 0644)
}

func (s *Server) loadLastFetched() time.Time {
	data, err := os.ReadFile(s.lastFetchedFile)
	if err != nil {
		return time.Time{} // Return zero time if file doesn't exist
	}

	timestamp, err := time.Parse(time.RFC3339, string(data))
	if err != nil {
		return time.Time{}
	}

	return timestamp
}

func (s *Server) saveLastFetched(t time.Time) error {
	return os.WriteFile(s.lastFetchedFile, []byte(t.UTC().Format(time.RFC3339)), 0644)
}

func (s *Server) downloadMediaFile(item MediaItem) error {
	// Build URL to uploader server's file endpoint
	fileURL := fmt.Sprintf("%s/files/%s/%s", s.serverURL, s.frameID, item.Filename)

	// Fetch the file from uploader server
	resp, err := http.Get(fileURL)
	if err != nil {
		return fmt.Errorf("failed to fetch file from uploader: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("uploader returned status %d for file %s", resp.StatusCode, item.Filename)
	}

	// Create destination file
	destPath := filepath.Join(s.cacheDir, item.Filename)

	// Check if file already exists
	if _, err := os.Stat(destPath); err == nil {
		// File already exists, skip download
		return nil
	}

	destFile, err := os.Create(destPath)
	if err != nil {
		return fmt.Errorf("failed to create cache file: %v", err)
	}
	defer destFile.Close()

	// Copy the file content
	if _, err := io.Copy(destFile, resp.Body); err != nil {
		os.Remove(destPath) // Clean up partial file
		return fmt.Errorf("failed to write file to cache: %v", err)
	}

	return nil
}
