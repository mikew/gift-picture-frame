package main

import (
	"fmt"
	"os"

	"picture-frame/cmd/client"
	"picture-frame/cmd/server"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "picture-frame",
	Short: "A picture frame application with server and client components",
	Long:  "A picture frame application that allows uploading and displaying media",
}

func init() {
	rootCmd.AddCommand(server.ServerCmd)
	rootCmd.AddCommand(client.ClientCmd)
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}