package ui

import (
	"embed"
	"io/fs"
)

//go:embed client-ui/build/*
var clientFiles embed.FS

func ClientFiles() fs.FS {
	prefixed, _ := fs.Sub(clientFiles, "client-ui/build")

	return prefixed
}

//go:embed server-ui/build/*
var serverFiles embed.FS

func ServerFiles() fs.FS {
	prefixed, _ := fs.Sub(serverFiles, "server-ui/build")

	return prefixed
}
