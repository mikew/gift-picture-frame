package main

import (
	"log"
	"os"
	"picture-frame/internal/client"
	"picture-frame/internal/server"
	"picture-frame/internal/ui"

	"github.com/urfave/cli/v2"
)

func main() {
	app := &cli.App{
		Name:  "picture-frame",
		Usage: "A picture frame application with server and client components",
		Commands: []*cli.Command{
			{
				Name:  "server",
				Usage: "Server commands",
				Subcommands: []*cli.Command{
					{
						Name:  "start",
						Usage: "Start the picture frame server",
						Flags: []cli.Flag{
							&cli.IntFlag{
								Name:  "port",
								Value: 8080,
								Usage: "Port to run the server on",
							},
						},
						Action: func(ctx *cli.Context) error {
							port := ctx.Int("port")
							srv := server.NewServer(ui.ServerFiles())
							return srv.Start(port)
						},
					},
				},
			},
			{
				Name:  "client",
				Usage: "Client commands",
				Subcommands: []*cli.Command{
					{
						Name:  "start",
						Usage: "Start the picture frame client",
						Flags: []cli.Flag{
							&cli.StringFlag{
								Name:     "id",
								Usage:    "Frame ID",
								Required: true,
							},
							&cli.StringFlag{
								Name:     "server",
								Usage:    "Server URL",
								Required: true,
							},
							&cli.IntFlag{
								Name:  "port",
								Value: 6376,
								Usage: "Local port for the client server",
							},
						},
						Action: func(ctx *cli.Context) error {
							id := ctx.String("id")
							serverURL := ctx.String("server")
							port := ctx.Int("port")

							c := client.NewClient(id, serverURL, port, ui.ClientFiles())
							return c.Start()
						},
					},
				},
			},
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
