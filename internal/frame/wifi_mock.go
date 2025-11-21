package frame

type MockWifiManager struct{}

func NewMockWifiManager() *MockWifiManager {
	return &MockWifiManager{}
}

func (w *MockWifiManager) Connect(ssid string, password string) error {
	return nil
}

func (w *MockWifiManager) ScanForNetworks() ([]WifiNetwork, error) {
	networks := []WifiNetwork{
		{SSID: "MockNetwork1", Signal: 80, Security: "WPA2"},
		{SSID: "MockNetwork2", Signal: 60, Security: "WEP"},
		{SSID: "OpenNetwork", Signal: 40, Security: "None"},
	}

	return networks, nil
}
