package rotation

import (
	"encoding/json"
	"fmt"
	"os/exec"
)

type WlrRandrOutput struct {
	Name      string `json:"name"`
	Enabled   bool   `json:"enabled"`
	Transform string `json:"transform"`
}

type WlrRandrRotator struct{}

func NewWlrRandrRotator() *WlrRandrRotator {
	return &WlrRandrRotator{}
}

func (r *WlrRandrRotator) SetRotation(degrees int) error {
	output, err := GetFirstEnabledOutput()
	if err != nil {
		return fmt.Errorf("failed to get first enabled output: %v", err)
	}

	newTransform := DegreesToWlrRandrTransform(degrees)
	cmd := exec.Command("wlr-randr", "--output", output.Name, "--transform", newTransform)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to run wlr-randr: %v", err)
	}

	return nil
}

func WlrRandrTransformToDegrees(transform string) int {
	switch transform {
	case "normal":
		return 0
	case "90":
		return 90
	case "180":
		return 180
	case "270":
		return 270
	default:
		return 0
	}
}

func DegreesToWlrRandrTransform(degrees int) string {
	switch degrees {
	case 0:
		return "normal"
	case 90:
		return "90"
	case 180:
		return "180"
	case 270:
		return "270"
	default:
		return "normal"
	}
}

func GetFirstEnabledOutput() (*WlrRandrOutput, error) {
	output, err := exec.Command("wlr-randr", "--json").Output()
	if err != nil {
		return nil, fmt.Errorf("failed to run wlr-randr: %v", err)
	}

	var outputs []WlrRandrOutput
	if err := json.Unmarshal(output, &outputs); err != nil {
		return nil, fmt.Errorf("failed to parse wlr-randr output: %v", err)
	}

	for i := range outputs {
		if outputs[i].Enabled {
			return &outputs[i], nil
		}
	}

	return nil, fmt.Errorf("no enabled outputs found")
}
