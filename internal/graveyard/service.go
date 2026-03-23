package graveyard

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"time"
)

type Service struct {
	cfg    Config
	runner runner
}

func NewService(cfg Config) Service {
	return Service{
		cfg:    cfg,
		runner: newRunner(cfg),
	}
}

func (s Service) Bury(ctx context.Context, names []string) error {
	repo, err := s.loadArchiveRepo(ctx)
	if err != nil {
		return err
	}

	if err := s.ensureGHAuth(ctx); err != nil {
		return err
	}

	repos, err := s.listRepositories(ctx, repo.Name)
	if err != nil {
		return err
	}

	selected, err := s.resolveSelection(ctx, names, repos)
	if err != nil {
		if errors.Is(err, errSelectionCanceled) {
			return fmt.Errorf("aborted")
		}
		return err
	}
	if len(selected) == 0 {
		return fmt.Errorf("no repositories selected")
	}

	if err := s.confirmSelection(selected); err != nil {
		return err
	}

	for _, deadRepo := range selected {
		if err := s.archiveRepository(ctx, repo.Root, deadRepo); err != nil {
			return err
		}
	}

	if !s.cfg.DryRun {
		changed, err := s.stageGraves(ctx, repo.Root)
		if err != nil {
			return err
		}

		if changed {
			if err := s.commitArchive(ctx, repo, selected); err != nil {
				return err
			}
		} else {
			fmt.Fprintln(s.cfg.Stdout, "No graves changes to commit.")
		}

		needsPush, err := s.hasUnpushedCommits(ctx, repo)
		if err != nil {
			return err
		}
		if needsPush {
			if err := s.pushArchive(ctx, repo); err != nil {
				return err
			}
		}
	}

	if !s.cfg.DryRun && !s.cfg.KeepRemote {
		for _, deadRepo := range selected {
			if err := s.deleteRemoteRepository(ctx, deadRepo); err != nil {
				return err
			}
		}
	}

	if !s.cfg.DryRun {
		if err := s.clearLocalGraves(ctx, repo.Root); err != nil {
			return err
		}
	}

	fmt.Fprintf(s.cfg.Stdout, "Processed %d repos.\n", len(selected))
	return nil
}

func (s Service) ensureGHAuth(ctx context.Context) error {
	if err := s.runner.run(ctx, "", "gh", "auth", "status"); err != nil {
		return fmt.Errorf("GitHub CLI auth required. Run `gh auth login` and `gh auth refresh -s delete_repo` first: %w", err)
	}

	if !s.cfg.DryRun && !s.cfg.KeepRemote {
		scopes, err := s.activeScopes(ctx)
		if err != nil {
			return err
		}
		if !hasScope(scopes, "delete_repo") {
			return fmt.Errorf("GitHub CLI token for %s is missing the `delete_repo` scope. Run `gh auth refresh -h github.com -s delete_repo` before burying repos", s.cfg.Org)
		}
	}

	return nil
}

func (s Service) activeScopes(ctx context.Context) ([]string, error) {
	out, err := s.runner.output(ctx, "", "gh", "auth", "status", "--active", "--hostname", "github.com", "--json", "hosts", "--jq", `.hosts["github.com"][0].scopes`)
	if err != nil {
		return nil, fmt.Errorf("resolve GitHub CLI scopes: %w", err)
	}

	var scopes []string
	for _, scope := range strings.Split(out, ",") {
		scope = strings.TrimSpace(scope)
		if scope == "" {
			continue
		}
		scopes = append(scopes, scope)
	}

	return scopes, nil
}

func hasScope(scopes []string, wanted string) bool {
	for _, scope := range scopes {
		if scope == wanted {
			return true
		}
	}

	return false
}

func (s Service) listRepositories(ctx context.Context, currentRepoName string) ([]Repository, error) {
	ownerType, err := s.ownerType(ctx)
	if err != nil {
		return nil, err
	}

	activeLogin, err := s.activeLogin(ctx)
	if err != nil {
		return nil, err
	}

	repos, err := s.fetchAllRepositories(ctx, ownerType, activeLogin)
	if err != nil {
		return nil, err
	}

	filtered := repos[:0]
	for _, repo := range repos {
		if repo.Name == currentRepoName || repo.Name == "" || repo.SSHURL == "" {
			continue
		}
		filtered = append(filtered, repo)
	}

	slices.SortFunc(filtered, func(a Repository, b Repository) int {
		return strings.Compare(a.Name, b.Name)
	})

	return filtered, nil
}

func (s Service) ownerType(ctx context.Context) (string, error) {
	out, err := s.runner.output(ctx, "", "gh", "api", "users/"+s.cfg.Org, "--jq", ".type")
	if err != nil {
		return "", fmt.Errorf("resolve owner type for %s: %w", s.cfg.Org, err)
	}

	switch strings.TrimSpace(out) {
	case "User", "Organization":
		return strings.TrimSpace(out), nil
	default:
		return "", fmt.Errorf("unsupported owner type %q for %s", strings.TrimSpace(out), s.cfg.Org)
	}
}

func (s Service) activeLogin(ctx context.Context) (string, error) {
	out, err := s.runner.output(ctx, "", "gh", "api", "user", "--jq", ".login")
	if err != nil {
		return "", fmt.Errorf("resolve active login: %w", err)
	}

	return strings.TrimSpace(out), nil
}

func (s Service) fetchAllRepositories(ctx context.Context, ownerType string, activeLogin string) ([]Repository, error) {
	repos := make([]Repository, 0, 128)
	for page := 1; ; page++ {
		pageRepos, err := s.fetchRepositoryPage(ctx, ownerType, activeLogin, page)
		if err != nil {
			return nil, err
		}
		if len(pageRepos) == 0 {
			return repos, nil
		}

		for _, repo := range pageRepos {
			repos = append(repos, Repository{Name: repo.Name, SSHURL: repo.SSHURL})
			if s.cfg.Limit > 0 && len(repos) >= s.cfg.Limit {
				return repos[:s.cfg.Limit], nil
			}
		}
		if len(pageRepos) < 100 {
			return repos, nil
		}
	}
}

type githubRepositoryListItem struct {
	Name   string `json:"name"`
	SSHURL string `json:"ssh_url"`
}

func (s Service) fetchRepositoryPage(ctx context.Context, ownerType string, activeLogin string, page int) ([]githubRepositoryListItem, error) {
	endpoint := s.repositoriesEndpoint(ownerType, activeLogin, page)
	out, err := s.runner.output(ctx, "", "gh", "api", endpoint)
	if err != nil {
		return nil, err
	}

	var repos []githubRepositoryListItem
	if err := json.Unmarshal([]byte(out), &repos); err != nil {
		return nil, fmt.Errorf("parse repository page %d: %w", page, err)
	}

	return repos, nil
}

func (s Service) repositoriesEndpoint(ownerType string, activeLogin string, page int) string {
	switch {
	case ownerType == "User" && activeLogin == s.cfg.Org:
		return fmt.Sprintf("user/repos?affiliation=owner&per_page=100&page=%d", page)
	case ownerType == "Organization":
		return fmt.Sprintf("orgs/%s/repos?type=all&per_page=100&page=%d", s.cfg.Org, page)
	default:
		return fmt.Sprintf("users/%s/repos?type=owner&per_page=100&page=%d", s.cfg.Org, page)
	}
}

func (s Service) confirmSelection(repos []Repository) error {
	action := "archive and delete"
	if s.cfg.KeepRemote {
		action = "archive"
	}

	fmt.Fprintf(s.cfg.Stdout, "About to %s %d repos from %s:\n", action, len(repos), s.cfg.Org)
	for _, repo := range repos {
		fmt.Fprintf(s.cfg.Stdout, "  - %s\n", repo.Name)
	}
	if s.cfg.DryRun {
		fmt.Fprintln(s.cfg.Stdout, "Dry run enabled. No files or repositories will be changed.")
		return nil
	}
	if s.cfg.Yes {
		return nil
	}

	fmt.Fprint(s.cfg.Stdout, "Continue? [y/N]: ")
	reader := bufio.NewReader(s.cfg.Stdin)
	line, err := reader.ReadString('\n')
	if err != nil && line == "" {
		return err
	}

	answer := strings.ToLower(strings.TrimSpace(line))
	if answer != "y" && answer != "yes" {
		return fmt.Errorf("aborted")
	}

	return nil
}

func (s Service) archiveRepository(ctx context.Context, repoRoot string, repo Repository) error {
	fmt.Fprintf(s.cfg.Stdout, "\nBurying %s...\n", repo.Name)

	if s.cfg.DryRun {
		if s.cfg.KeepRemote {
			fmt.Fprintf(s.cfg.Stdout, "Would archive %s into %s\n", repo.Name, s.cfg.gravesRoot(repoRoot))
		} else {
			fmt.Fprintf(s.cfg.Stdout, "Would archive %s into %s and delete %s/%s\n", repo.Name, s.cfg.gravesRoot(repoRoot), s.cfg.Org, repo.Name)
		}
		return nil
	}

	tmpDir, err := os.MkdirTemp("", "graveyard-*")
	if err != nil {
		return err
	}
	defer os.RemoveAll(tmpDir)

	cloneDir := filepath.Join(tmpDir, repo.Name)
	if err := s.runner.run(ctx, tmpDir, "git", "clone", s.cfg.cloneURL(repo), cloneDir); err != nil {
		return err
	}

	bundlesDir := filepath.Join(s.cfg.gravesRoot(repoRoot), "bundles")
	if err := os.MkdirAll(bundlesDir, 0o755); err != nil {
		return err
	}

	targetDir := s.cfg.graveRepoDir(repoRoot, repo.Name)
	if err := recreateDir(targetDir); err != nil {
		return err
	}

	bundlePath := s.cfg.graveBundlePath(repoRoot, repo.Name)
	if isEmpty := !s.runner.success(ctx, cloneDir, "git", "rev-parse", "--verify", "HEAD"); isEmpty {
		return writeEmptyRepositoryArchive(targetDir, bundlePath, repo, s.cfg.Org)
	}

	if err := s.runner.run(ctx, cloneDir, "git", "bundle", "create", bundlePath, "--all"); err != nil {
		return err
	}

	return copyWorkingTree(cloneDir, targetDir)
}

func (s Service) deleteRemoteRepository(ctx context.Context, repo Repository) error {
	if err := s.runner.run(ctx, "", "gh", "repo", "delete", s.cfg.Org+"/"+repo.Name, "--yes"); err != nil {
		return err
	}

	fmt.Fprintf(s.cfg.Stdout, "Deleted remote repository %s/%s\n", s.cfg.Org, repo.Name)
	return nil
}

func writeEmptyRepositoryArchive(targetDir string, bundlePath string, repo Repository, owner string) error {
	if err := os.RemoveAll(bundlePath); err != nil && !os.IsNotExist(err) {
		return err
	}

	metadata := fmt.Sprintf(
		"repository=%s/%s\nssh_url=%s\nempty=true\narchived_at=%s\n",
		owner,
		repo.Name,
		repo.SSHURL,
		time.Now().UTC().Format(time.RFC3339),
	)

	return os.WriteFile(filepath.Join(targetDir, ".graveyard-empty-repo"), []byte(metadata), 0o644)
}
