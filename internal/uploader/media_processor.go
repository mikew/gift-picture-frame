package uploader

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

type MediaProcessor interface {
	Process(inputPath string) (string, error)
}

type ImageProcessor struct {
	MaxWidth  int
	MaxHeight int
}

func NewImageProcessor() *ImageProcessor {
	return &ImageProcessor{
		MaxWidth:  1280,
		MaxHeight: 1280,
	}
}

func (p *ImageProcessor) Process(inputPath string) (string, error) {
	outputFile, err := os.CreateTemp("", "processed-*.webp")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	outputPath := outputFile.Name()
	outputFile.Close()

	resizeArg := fmt.Sprintf("%dx%d>", p.MaxWidth, p.MaxHeight)

	cmd := exec.Command("convert",
		inputPath,
		"-resize", resizeArg,
		"-quality", "85",
		"-define", "webp:method=6",
		outputPath,
	)

	output, err := cmd.CombinedOutput()
	if err != nil {
		os.Remove(outputPath)
		return "", fmt.Errorf("imagemagick convert failed: %w\nOutput: %s", err, string(output))
	}

	return outputPath, nil
}

type VideoProcessor struct{}

func NewVideoProcessor() *VideoProcessor {
	return &VideoProcessor{}
}

func (p *VideoProcessor) Process(inputPath string) (string, error) {
	outputFile, err := os.CreateTemp("", "processed-*.mp4")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	outputPath := outputFile.Name()
	outputFile.Close()

	cmd := exec.Command("ffmpeg",
		"-i", inputPath,
		"-c:v", "libx264",
		"-preset", "medium",
		"-crf", "23",
		"-c:a", "aac",
		"-b:a", "128k",
		"-movflags", "+faststart",
		"-y",
		outputPath,
	)

	output, err := cmd.CombinedOutput()
	if err != nil {
		os.Remove(outputPath)
		return "", fmt.Errorf("ffmpeg failed: %w\nOutput: %s", err, string(output))
	}

	return outputPath, nil
}

type GIFProcessor struct{}

func NewGIFProcessor() *GIFProcessor {
	return &GIFProcessor{}
}

func (p *GIFProcessor) Process(inputPath string) (string, error) {
	outputFile, err := os.CreateTemp("", "processed-*.mp4")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	outputPath := outputFile.Name()
	outputFile.Close()

	cmd := exec.Command("ffmpeg",
		"-i", inputPath,
		"-movflags", "faststart",
		"-pix_fmt", "yuv420p",
		"-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
		"-c:v", "libx264",
		"-preset", "medium",
		"-crf", "23",
		"-y",
		outputPath,
	)

	output, err := cmd.CombinedOutput()
	if err != nil {
		os.Remove(outputPath)
		return "", fmt.Errorf("ffmpeg failed: %w\nOutput: %s", err, string(output))
	}

	return outputPath, nil
}

func GetMediaProcessor(filename string) MediaProcessor {
	ext := strings.ToLower(filepath.Ext(filename))

	switch ext {
	case ".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp":
		return NewImageProcessor()
	case ".gif":
		return NewGIFProcessor()
	case ".mp4", ".avi", ".mov", ".webm", ".mkv", ".flv":
		return NewVideoProcessor()
	default:
		return nil
	}
}

func DetermineMediaType(filename string) string {
	ext := strings.ToLower(filepath.Ext(filename))

	switch ext {
	case ".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp":
		return "image"
	case ".gif":
		return "video"
	case ".mp4", ".avi", ".mov", ".webm", ".mkv", ".flv":
		return "video"
	default:
		return "unknown"
	}
}
