package ui

import (
	"embed"
	"io/fs"
)

//go:embed all:frame-ui/build/client/*
var frameFiles embed.FS

func FrameFiles() fs.FS {
	prefixed, _ := fs.Sub(frameFiles, "frame-ui/build/client")

	return prefixed
}

//go:embed all:uploader-ui/build/client/*
var uploaderFiles embed.FS

func UploaderFiles() fs.FS {
	prefixed, _ := fs.Sub(uploaderFiles, "uploader-ui/build/client")

	return prefixed
}
