package main

import (
	"log"
	"os"
	"picture-frame/internal/frame"
	"picture-frame/internal/ui"
	"picture-frame/internal/uploader"

	"github.com/urfave/cli/v2"
)

func main() {
	app := &cli.App{
		Name:  "picture-frame",
		Usage: "A picture frame application",
		Commands: []*cli.Command{
			{
				Name:  "uploader",
				Usage: "Uploader commands",
				Subcommands: []*cli.Command{
					{
						Name:  "start",
						Usage: "Start the uploader server",
						Flags: []cli.Flag{
							&cli.IntFlag{
								Name:  "port",
								Value: 8080,
								Usage: "Port to run the server on",
							},
						},
						Action: func(ctx *cli.Context) error {
							port := ctx.Int("port")
							srv := uploader.NewServer(ui.UploaderFiles())
							return srv.Start(port)
						},
					},
				},
			},
			{
				Name:  "frame",
				Usage: "Frame commands",
				Subcommands: []*cli.Command{
					{
						Name:  "start",
						Usage: "Start the frame client",
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

							brightnessController := frame.NewRPiBrightnessController()
							outputRotator := frame.NewWlrRandrRotator()

							s := frame.NewServer(id, serverURL, port, ui.FrameFiles(), brightnessController, outputRotator)
							return s.Start()
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
