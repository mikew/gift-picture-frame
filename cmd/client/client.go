package client

import (
	"fmt"
	"log"

	"picture-frame/internal/client"

	"github.com/spf13/cobra"
)

var ClientCmd = &cobra.Command{
	Use:   "client",
	Short: "Client commands",
	Long:  "Commands for running the picture frame client",
}

var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start the picture frame client",
	Long:  "Start the picture frame client to display media from the server",
	Run: func(cmd *cobra.Command, args []string) {
		id, _ := cmd.Flags().GetString("id")
		serverURL, _ := cmd.Flags().GetString("server")
		port, _ := cmd.Flags().GetString("port")
		
		if id == "" {
			log.Fatal("Frame ID is required (--id)")
		}
		if serverURL == "" {
			log.Fatal("Server URL is required (--server)")
		}
		
		fmt.Printf("Starting picture frame client for ID: %s\n", id)
		fmt.Printf("Server URL: %s\n", serverURL)
		fmt.Printf("Local port: %s\n", port)
		
		client := client.NewClient(id, serverURL, port)
		if err := client.Start(); err != nil {
			log.Fatalf("Failed to start client: %v", err)
		}
	},
}

func init() {
	startCmd.Flags().StringP("id", "i", "", "Frame ID (required)")
	startCmd.Flags().StringP("server", "s", "", "Server URL (required)")
	startCmd.Flags().StringP("port", "p", "3000", "Local port for client server")
	
	startCmd.MarkFlagRequired("id")
	startCmd.MarkFlagRequired("server")
	
	ClientCmd.AddCommand(startCmd)
}