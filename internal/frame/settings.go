package frame

import (
	"encoding/json"
	"os"
)

type Settings struct {
	Brightness int `json:"brightness"`
	Rotation   int `json:"rotation"`
}

func loadSettings(settingsFile string) (*Settings, error) {
	data, err := os.ReadFile(settingsFile)
	if err != nil {
		if os.IsNotExist(err) {
			return &Settings{
				Brightness: 10,
				Rotation:   0,
			}, nil
		}

		return nil, err
	}

	var settings Settings
	if err := json.Unmarshal(data, &settings); err != nil {
		return nil, err
	}

	return &settings, nil
}

func saveSettings(settings *Settings, settingsFile string) error {
	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(settingsFile, data, 0644)
}
