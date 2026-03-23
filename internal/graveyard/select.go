package graveyard

import (
	"bufio"
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

var errSelectionCanceled = errors.New("selection canceled")

func (s Service) resolveSelection(ctx context.Context, names []string, repos []Repository) ([]Repository, error) {
	if len(repos) == 0 {
		return nil, fmt.Errorf("no repositories found in %s", s.cfg.Org)
	}

	if len(names) > 0 {
		return selectByName(names, repos, s.cfg.Org)
	}

	if s.cfg.SelectAll {
		return repos, nil
	}

	if s.canUseFZF() {
		return s.selectWithFZF(ctx, repos)
	}

	return s.selectWithPrompt(repos)
}

func selectByName(names []string, repos []Repository, org string) ([]Repository, error) {
	byName := make(map[string]Repository, len(repos))
	for _, repo := range repos {
		byName[repo.Name] = repo
	}

	selected := make([]Repository, 0, len(names))
	seen := make(map[string]bool, len(names))
	for _, name := range names {
		repo, ok := byName[name]
		if !ok {
			return nil, fmt.Errorf("repository %q not found in %s", name, org)
		}
		if seen[repo.Name] {
			continue
		}
		seen[repo.Name] = true
		selected = append(selected, repo)
	}

	return selected, nil
}

func (s Service) canUseFZF() bool {
	if _, err := exec.LookPath("fzf"); err != nil {
		return false
	}

	return isTerminalReader(s.cfg.Stdin) && isTerminalWriter(s.cfg.Stdout) && isTerminalWriter(s.cfg.Stderr)
}

func isTerminalReader(r io.Reader) bool {
	file, ok := r.(*os.File)
	if !ok {
		return false
	}

	info, err := file.Stat()
	if err != nil {
		return false
	}

	return info.Mode()&os.ModeCharDevice != 0
}

func isTerminalWriter(w io.Writer) bool {
	file, ok := w.(*os.File)
	if !ok {
		return false
	}

	info, err := file.Stat()
	if err != nil {
		return false
	}

	return info.Mode()&os.ModeCharDevice != 0
}

func (s Service) selectWithFZF(ctx context.Context, repos []Repository) ([]Repository, error) {
	lines := make([]string, 0, len(repos))
	for _, repo := range repos {
		lines = append(lines, repo.Name)
	}

	cmd := exec.CommandContext(
		ctx,
		"fzf",
		"--multi",
		"--prompt", "Select repos to bury > ",
		"--header", "UP/DOWN move, SPACE toggle, ENTER confirm, ESC cancel",
		"--border",
		"--height", "80%",
		"--layout", "reverse",
		"--bind", "space:toggle",
		"--marker", "✓",
		"--pointer", ">",
	)
	cmd.Stdin = strings.NewReader(strings.Join(lines, "\n"))
	cmd.Stderr = s.cfg.Stderr

	var stdout bytes.Buffer
	cmd.Stdout = &stdout

	if err := cmd.Run(); err != nil {
		var exitErr *exec.ExitError
		if errors.As(err, &exitErr) && (exitErr.ExitCode() == 1 || exitErr.ExitCode() == 130) {
			return nil, errSelectionCanceled
		}
		return nil, fmt.Errorf("fzf selection failed: %w", err)
	}

	raw := strings.TrimSpace(stdout.String())
	if raw == "" {
		return nil, errSelectionCanceled
	}

	return selectByName(strings.Split(raw, "\n"), repos, s.cfg.Org)
}

func (s Service) selectWithPrompt(repos []Repository) ([]Repository, error) {
	fmt.Fprintln(s.cfg.Stdout, "fzf not available or not interactive; using text prompt.")
	fmt.Fprintln(s.cfg.Stdout, "Enter `all`, repo names, indices like `1,3,8`, or ranges like `4-9`.")
	for i, repo := range repos {
		fmt.Fprintf(s.cfg.Stdout, "%3d. %s\n", i+1, repo.Name)
	}
	fmt.Fprint(s.cfg.Stdout, "Selection: ")

	reader := bufio.NewReader(s.cfg.Stdin)
	line, err := reader.ReadString('\n')
	if err != nil && line == "" {
		return nil, err
	}

	return parseSelection(strings.TrimSpace(line), repos)
}

func parseSelection(raw string, repos []Repository) ([]Repository, error) {
	if raw == "" {
		return nil, nil
	}

	if strings.EqualFold(strings.TrimSpace(raw), "all") {
		return repos, nil
	}

	byName := make(map[string]Repository, len(repos))
	for _, repo := range repos {
		byName[repo.Name] = repo
	}

	var selected []Repository
	seen := map[string]bool{}
	for _, token := range strings.Split(raw, ",") {
		token = strings.TrimSpace(token)
		if token == "" {
			continue
		}

		matches, err := parseSelectionToken(token, repos, byName)
		if err != nil {
			return nil, err
		}
		for _, repo := range matches {
			if seen[repo.Name] {
				continue
			}
			seen[repo.Name] = true
			selected = append(selected, repo)
		}
	}

	return selected, nil
}

func parseSelectionToken(token string, repos []Repository, byName map[string]Repository) ([]Repository, error) {
	if strings.Contains(token, "-") {
		return parseSelectionRange(token, repos)
	}

	if index, err := strconv.Atoi(token); err == nil {
		if index < 1 || index > len(repos) {
			return nil, fmt.Errorf("selection %d is out of range", index)
		}
		return []Repository{repos[index-1]}, nil
	}

	repo, ok := byName[token]
	if !ok {
		return nil, fmt.Errorf("unknown repository %q", token)
	}

	return []Repository{repo}, nil
}

func parseSelectionRange(token string, repos []Repository) ([]Repository, error) {
	parts := strings.SplitN(token, "-", 2)
	if len(parts) != 2 {
		return nil, fmt.Errorf("invalid range %q", token)
	}

	start, err := strconv.Atoi(strings.TrimSpace(parts[0]))
	if err != nil {
		return nil, fmt.Errorf("invalid range start %q", token)
	}
	end, err := strconv.Atoi(strings.TrimSpace(parts[1]))
	if err != nil {
		return nil, fmt.Errorf("invalid range end %q", token)
	}
	if start < 1 || end < 1 || start > len(repos) || end > len(repos) || start > end {
		return nil, fmt.Errorf("range %q is out of bounds", token)
	}

	selected := make([]Repository, 0, end-start+1)
	for i := start; i <= end; i++ {
		selected = append(selected, repos[i-1])
	}

	return selected, nil
}
