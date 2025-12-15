package frame

import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"
)

const (
	brightnessctlMinBrightness = 1
)

type BrightnessctlController struct {
	minBrightness int
	device        string
}

func NewBrightnessctlController() *BrightnessctlController {
	return &BrightnessctlController{
		minBrightness: brightnessctlMinBrightness,
		device:        "",
	}
}

func NewBrightnessctlControllerWithDevice(device string, minBrightness int) *BrightnessctlController {
	return &BrightnessctlController{
		minBrightness: minBrightness,
		device:        device,
	}
}

func (b *BrightnessctlController) runCommand(args ...string) (string, error) {
	if b.device != "" {
		args = append([]string{"-d", b.device}, args...)
	}

	cmd := exec.Command("brightnessctl", args...)
	output, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("brightnessctl command failed: %w", err)
	}

	return strings.TrimSpace(string(output)), nil
}

func (b *BrightnessctlController) GetBrightness() (int, error) {
	output, err := b.runCommand("get")
	if err != nil {
		return 0, fmt.Errorf("failed to get brightness: %w", err)
	}

	value, err := strconv.Atoi(output)
	if err != nil {
		return 0, fmt.Errorf("failed to parse brightness value: %w", err)
	}

	return value, nil
}

func (b *BrightnessctlController) GetMaxBrightness() (int, error) {
	output, err := b.runCommand("max")
	if err != nil {
		return 0, fmt.Errorf("failed to get max brightness: %w", err)
	}

	value, err := strconv.Atoi(output)
	if err != nil {
		return 0, fmt.Errorf("failed to parse max brightness value: %w", err)
	}

	return value, nil
}

func (b *BrightnessctlController) GetMinBrightness() (int, error) {
	return b.minBrightness, nil
}

func (b *BrightnessctlController) SetBrightness(level int) error {
	min, err := b.GetMinBrightness()
	if err != nil {
		return err
	}

	max, err := b.GetMaxBrightness()
	if err != nil {
		return err
	}

	if level < min {
		level = min
	}
	if level > max {
		level = max
	}

	_, err = b.runCommand("set", strconv.Itoa(level))
	if err != nil {
		return fmt.Errorf("failed to set brightness: %w", err)
	}

	return nil
}
