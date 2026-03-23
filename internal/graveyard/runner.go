package graveyard

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"strings"
)

type runner struct {
	cfg Config
}

func newRunner(cfg Config) runner {
	return runner{cfg: cfg}
}

func (r runner) run(ctx context.Context, dir string, name string, args ...string) error {
	cmd := exec.CommandContext(ctx, name, args...)
	cmd.Dir = dir
	cmd.Stdout = r.cfg.Stdout
	cmd.Stderr = r.cfg.Stderr
	cmd.Stdin = r.cfg.Stdin

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("%s %s: %w", name, strings.Join(args, " "), err)
	}

	return nil
}

func (r runner) runInput(ctx context.Context, dir string, input string, name string, args ...string) error {
	cmd := exec.CommandContext(ctx, name, args...)
	cmd.Dir = dir
	cmd.Stdout = r.cfg.Stdout
	cmd.Stderr = r.cfg.Stderr
	cmd.Stdin = strings.NewReader(input)

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("%s %s: %w", name, strings.Join(args, " "), err)
	}

	return nil
}

func (r runner) output(ctx context.Context, dir string, name string, args ...string) (string, error) {
	cmd := exec.CommandContext(ctx, name, args...)
	cmd.Dir = dir

	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return "", commandError(name, args, err, &stdout, &stderr)
	}

	return strings.TrimSpace(stdout.String()), nil
}

func (r runner) success(ctx context.Context, dir string, name string, args ...string) bool {
	cmd := exec.CommandContext(ctx, name, args...)
	cmd.Dir = dir
	return cmd.Run() == nil
}

func commandError(name string, args []string, err error, stdout *bytes.Buffer, stderr *bytes.Buffer) error {
	msg := strings.TrimSpace(stderr.String())
	if msg == "" {
		msg = strings.TrimSpace(stdout.String())
	}
	if msg != "" {
		return fmt.Errorf("%s %s: %s", name, strings.Join(args, " "), msg)
	}
	return fmt.Errorf("%s %s: %w", name, strings.Join(args, " "), err)
}
