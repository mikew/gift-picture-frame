package frame

import (
	"fmt"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
)

type NmcliWifiManager struct{}

func NewNmcliWifiManager() *NmcliWifiManager {
	return &NmcliWifiManager{}
}

func (w *NmcliWifiManager) Connect(ssid string, password string) error {
	// nmcli seems to throw an error when trying to connect to an already known
	// network? Something about `802-11-wireless-security.key-mgmt: property is
	// missing`
	deleteCmd := exec.Command("nmcli", "connection", "delete", ssid)
	_ = deleteCmd.Run()

	cmd := exec.Command("nmcli", "device", "wifi", "connect", ssid, "password", password)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to connect to WiFi network %s: %v, output: %s", ssid, err, string(output))
	}
	return nil
}

func (w *NmcliWifiManager) ScanForNetworks() ([]WifiNetwork, error) {
	rescanCmd := exec.Command("nmcli", "device", "wifi", "rescan")
	// Ignore errors as the scan might be rate-limited
	_ = rescanCmd.Run()

	cmd := exec.Command("nmcli", "-f", "SSID,SIGNAL,SECURITY", "device", "wifi", "list")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("failed to scan for WiFi networks: %v, output: %s", err, string(output))
	}

	return parseNmcliOutput(string(output))
}

func parseNmcliOutput(output string) ([]WifiNetwork, error) {
	lines := strings.Split(output, "\n")
	if len(lines) < 2 {
		return []WifiNetwork{}, nil
	}

	alreadySeen := make(map[string]bool)

	var networks []WifiNetwork
	// Skip the header line
	for i := 1; i < len(lines); i++ {
		line := strings.TrimSpace(lines[i])
		if line == "" {
			continue
		}

		re := regexp.MustCompile(`^(.+?)\s+(\d+)\s+(.+)$`)
		matches := re.FindStringSubmatch(line)

		if len(matches) == 4 {
			ssid := strings.TrimSpace(matches[1])
			signalStr := strings.TrimSpace(matches[2])
			security := strings.TrimSpace(matches[3])

			if ssid == "" || ssid == "--" {
				continue
			}

			signal, err := strconv.Atoi(signalStr)
			if err != nil {
				continue
			}

			if alreadySeen[ssid] {
				continue
			}
			alreadySeen[ssid] = true

			networks = append(networks, WifiNetwork{
				SSID:     ssid,
				Signal:   signal,
				Security: security,
			})
		}
	}

	return networks, nil
}
