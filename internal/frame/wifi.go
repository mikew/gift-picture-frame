package frame

type WifiNetwork struct {
	SSID     string `json:"ssid"`
	Signal   int    `json:"signal"`
	Security string `json:"security"`
}

type WifiManager interface {
	Connect(ssid string, password string) error
	ScanForNetworks() ([]WifiNetwork, error)
}
