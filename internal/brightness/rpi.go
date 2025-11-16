package brightness

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

const (
	defaultMinBrightness = 1
)

type RPiBrightnessController struct {
	backlightPath string
	minBrightness int
}

func NewRPiBrightnessController() *RPiBrightnessController {
	return &RPiBrightnessController{
		backlightPath: "/sys/class/backlight/10-0045",
		minBrightness: defaultMinBrightness,
	}
}

func NewRPiBrightnessControllerWithPath(path string, minBrightness int) *RPiBrightnessController {
	return &RPiBrightnessController{
		backlightPath: path,
		minBrightness: minBrightness,
	}
}

func (r *RPiBrightnessController) readIntFromFile(filename string) (int, error) {
	path := fmt.Sprintf("%s/%s", r.backlightPath, filename)
	data, err := os.ReadFile(path)
	if err != nil {
		return 0, fmt.Errorf("failed to read %s: %w", filename, err)
	}

	value, err := strconv.Atoi(strings.TrimSpace(string(data)))
	if err != nil {
		return 0, fmt.Errorf("failed to parse %s value: %w", filename, err)
	}

	return value, nil
}

func (r *RPiBrightnessController) writeIntToFile(filename string, value int) error {
	path := fmt.Sprintf("%s/%s", r.backlightPath, filename)
	data := []byte(strconv.Itoa(value))

	err := os.WriteFile(path, data, 0644)
	if err != nil {
		return fmt.Errorf("failed to write to %s: %w", filename, err)
	}

	return nil
}

func (r *RPiBrightnessController) GetBrightness() (int, error) {
	return r.readIntFromFile("brightness")
}

func (r *RPiBrightnessController) GetMaxBrightness() (int, error) {
	return r.readIntFromFile("max_brightness")
}

func (r *RPiBrightnessController) GetMinBrightness() (int, error) {
	return r.minBrightness, nil
}

func (r *RPiBrightnessController) SetBrightness(level int) error {
	min, err := r.GetMinBrightness()
	if err != nil {
		return err
	}

	max, err := r.GetMaxBrightness()
	if err != nil {
		return err
	}

	if level < min {
		level = min
	}
	if level > max {
		level = max
	}

	return r.writeIntToFile("brightness", level)
}
