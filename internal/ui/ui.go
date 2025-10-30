package ui

import (
	"embed"
	"fmt"
	"io/fs"
)

//go:embed client-ui/build/*
var clientFiles embed.FS

func ClientFiles() fs.FS {
	prefixed, _ := fs.Sub(clientFiles, "client-ui/build/client")

	Dump(prefixed, ".")

	return prefixed
}

//go:embed all:server-ui/build/client/*
var serverFiles embed.FS

func ServerFiles() fs.FS {
	prefixed, _ := fs.Sub(serverFiles, "server-ui/build/client")

	Dump(prefixed, ".")

	return prefixed
}

func Dump(fsys fs.FS, root string) {
	err := fs.WalkDir(fsys, root, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			fmt.Printf("error accessing %s: %v\n", path, err)
			return nil
		}
		if d.IsDir() {
			fmt.Printf("[DIR]  %s\n", path)
		} else {
			fmt.Printf("[FILE] %s\n", path)
		}
		return nil
	})
	if err != nil {
		fmt.Println("walk error:", err)
	}
}
