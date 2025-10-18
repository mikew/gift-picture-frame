package server

import (
	"fmt"
	"log"

	"picture-frame/internal/server"

	"github.com/spf13/cobra"
)

var ServerCmd = &cobra.Command{
	Use:   "server",
	Short: "Server commands",
	Long:  "Commands for running the picture frame server",
}

var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start the picture frame server",
	Long:  "Start the picture frame server to handle media uploads",
	Run: func(cmd *cobra.Command, args []string) {
		port, _ := cmd.Flags().GetString("port")
		dataDir, _ := cmd.Flags().GetString("data-dir")
		
		fmt.Printf("Starting picture frame server on port %s\n", port)
		fmt.Printf("Data directory: %s\n", dataDir)
		
		srv := server.NewServer(port, dataDir)
		if err := srv.Start(); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	},
}

func init() {
	startCmd.Flags().StringP("port", "p", "8080", "Port to run the server on")
	startCmd.Flags().StringP("data-dir", "d", "./data", "Directory to store uploaded media")
	
	ServerCmd.AddCommand(startCmd)
}