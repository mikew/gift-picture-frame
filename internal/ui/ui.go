package ui

import (
	"embed"
	"io/fs"
)

//go:embed client-ui/build/*
var clientFiles embed.FS

func ClientFiles() fs.FS {
	prefixed, _ := fs.Sub(clientFiles, "client-ui/build/client")

	return prefixed
}

//go:embed all:server-ui/build/client/*
var serverFiles embed.FS

func ServerFiles() fs.FS {
	prefixed, _ := fs.Sub(serverFiles, "server-ui/build/client")

	return prefixed
}
