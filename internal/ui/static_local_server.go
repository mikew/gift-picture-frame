package ui

import (
	"net/http"
	"strings"
)

type StaticLocalFS struct{ http.FileSystem }

func (s StaticLocalFS) Exists(prefix, p string) bool {
	if len(prefix) > 1 && strings.HasPrefix(p, prefix) {
		p = strings.TrimPrefix(p, prefix)
	}

	f, err := s.Open(p)
	if err != nil {
		return false
	}

	_ = f.Close()

	return true
}
