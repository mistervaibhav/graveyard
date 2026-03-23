package graveyard

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

type archiveRepo struct {
	Name   string
	Root   string
	Branch string
}

func (s Service) loadArchiveRepo(ctx context.Context) (archiveRepo, error) {
	root, err := s.runner.output(ctx, "", "git", "rev-parse", "--show-toplevel")
	if err != nil {
		return archiveRepo{}, fmt.Errorf("run this command inside the archive repository: %w", err)
	}

	if err := s.ensureArchiveRemoteAlias(ctx, root); err != nil {
		return archiveRepo{}, err
	}

	branch, err := s.currentBranch(ctx, root)
	if err != nil {
		return archiveRepo{}, err
	}

	return archiveRepo{
		Name:   filepath.Base(root),
		Root:   root,
		Branch: branch,
	}, nil
}

func (s Service) currentBranch(ctx context.Context, repoRoot string) (string, error) {
	branch, err := s.runner.output(ctx, repoRoot, "git", "branch", "--show-current")
	if err == nil && branch != "" {
		return branch, nil
	}

	out, err := s.runner.output(ctx, repoRoot, "git", "remote", "show", "origin")
	if err != nil {
		return "main", nil
	}

	for _, line := range strings.Split(out, "\n") {
		line = strings.TrimSpace(line)
		if !strings.HasPrefix(line, "HEAD branch:") {
			continue
		}

		head := strings.TrimSpace(strings.TrimPrefix(line, "HEAD branch:"))
		if head != "" && head != "(unknown)" {
			return head, nil
		}
	}

	return "main", nil
}

func (s Service) ensureArchiveRemoteAlias(ctx context.Context, repoRoot string) error {
	if s.cfg.SSHHostAlias == "" {
		return nil
	}

	currentURL, err := s.runner.output(ctx, repoRoot, "git", "remote", "get-url", "origin")
	if err != nil {
		return nil
	}

	rewrittenURL := s.cfg.rewriteSSHURL(strings.TrimSpace(currentURL))
	if rewrittenURL == "" || rewrittenURL == currentURL {
		return nil
	}

	if err := s.runner.run(ctx, repoRoot, "git", "remote", "set-url", "origin", rewrittenURL); err != nil {
		return err
	}

	if err := s.runner.run(ctx, repoRoot, "git", "remote", "set-url", "--push", "origin", rewrittenURL); err != nil {
		return err
	}

	fmt.Fprintf(s.cfg.Stdout, "Updated origin remote to use %s\n", s.cfg.SSHHostAlias)
	return nil
}

func (s Service) stageGraves(ctx context.Context, repoRoot string) (bool, error) {
	gravesPath := filepath.ToSlash(s.cfg.GravesDir)
	if err := s.runner.run(ctx, repoRoot, "git", "add", "--sparse", "-A", "-f", "--", gravesPath); err != nil {
		return false, err
	}

	status, err := s.runner.output(ctx, repoRoot, "git", "status", "--short", "--", gravesPath)
	if err != nil {
		return false, err
	}

	return status != "", nil
}

func (s Service) commitArchive(ctx context.Context, repo archiveRepo, repos []Repository) error {
	return s.runner.run(ctx, repo.Root, "git", "commit", "-m", archiveCommitMessage(repos))
}

func archiveCommitMessage(repos []Repository) string {
	timestamp := time.Now().UTC().Format(time.RFC3339)
	if len(repos) == 1 {
		return fmt.Sprintf("Archived %s at %s", repos[0].Name, timestamp)
	}
	return fmt.Sprintf("Archived %d repos at %s", len(repos), timestamp)
}

func (s Service) pushArchive(ctx context.Context, repo archiveRepo) error {
	return s.runner.run(ctx, repo.Root, "git", "push", "origin", repo.Branch)
}

func (s Service) hasLocalCommits(ctx context.Context, repoRoot string) bool {
	return s.runner.success(ctx, repoRoot, "git", "rev-parse", "--verify", "HEAD")
}

func (s Service) hasUnpushedCommits(ctx context.Context, repo archiveRepo) (bool, error) {
	if !s.hasLocalCommits(ctx, repo.Root) {
		return false, nil
	}

	if !s.runner.success(ctx, repo.Root, "git", "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}") {
		return true, nil
	}

	countRaw, err := s.runner.output(ctx, repo.Root, "git", "rev-list", "--count", "@{u}..HEAD")
	if err != nil {
		return false, err
	}

	count, err := strconv.Atoi(strings.TrimSpace(countRaw))
	if err != nil {
		return false, fmt.Errorf("parse unpushed commit count %q: %w", countRaw, err)
	}

	return count > 0, nil
}

func (s Service) clearLocalGraves(ctx context.Context, repoRoot string) error {
	if !s.cfg.ClearLocalGraves {
		return nil
	}

	gravesName := strings.Trim(filepath.ToSlash(s.cfg.GravesDir), "/")
	patterns := fmt.Sprintf("/*\n!/%s/\n", gravesName)
	if err := s.runner.runInput(ctx, repoRoot, patterns, "git", "sparse-checkout", "set", "--no-cone", "--stdin"); err != nil {
		return err
	}

	if err := os.RemoveAll(s.cfg.gravesRoot(repoRoot)); err != nil {
		return err
	}

	fmt.Fprintf(s.cfg.Stdout, "Cleared local %s working tree.\n", s.cfg.GravesDir)
	return nil
}
