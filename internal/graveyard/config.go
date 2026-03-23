package graveyard

import (
	"io"
	"path/filepath"
	"strings"
)

type Config struct {
	Org              string
	GravesDir        string
	Limit            int
	SSHHostAlias     string
	SelectAll        bool
	DryRun           bool
	Yes              bool
	KeepRemote       bool
	ClearLocalGraves bool
	Stdin            io.Reader
	Stdout           io.Writer
	Stderr           io.Writer
}

func (c Config) gravesRoot(repoRoot string) string {
	return filepath.Join(repoRoot, c.GravesDir)
}

func (c Config) graveRepoDir(repoRoot string, repoName string) string {
	return filepath.Join(c.gravesRoot(repoRoot), repoName)
}

func (c Config) graveBundlePath(repoRoot string, repoName string) string {
	return filepath.Join(c.gravesRoot(repoRoot), "bundles", repoName+".bundle")
}

func (c Config) cloneURL(repo Repository) string {
	return c.rewriteSSHURL(repo.SSHURL)
}

func (c Config) rewriteSSHURL(rawURL string) string {
	if c.SSHHostAlias == "" {
		return rawURL
	}

	const prefix = "git@"
	if !strings.HasPrefix(rawURL, prefix) {
		return rawURL
	}

	rest := strings.TrimPrefix(rawURL, prefix)
	parts := strings.SplitN(rest, ":", 2)
	if len(parts) != 2 {
		return rawURL
	}

	return prefix + c.SSHHostAlias + ":" + parts[1]
}

type Repository struct {
	Name   string `json:"name"`
	SSHURL string `json:"sshUrl"`
}
