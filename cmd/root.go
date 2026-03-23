package cmd

import (
	"context"
	"os"

	"github.com/spf13/cobra"

	"graveyard/internal/graveyard"
)

var cfg = graveyard.Config{
	Org:              "mistervaibhav",
	GravesDir:        "graves",
	SSHHostAlias:     "github.com-mistervaibhav",
	ClearLocalGraves: true,
	Stdin:            os.Stdin,
	Stdout:           os.Stdout,
	Stderr:           os.Stderr,
}

var rootCmd = &cobra.Command{
	Use:           "graveyard",
	Short:         "Archive GitHub repositories into this repo",
	SilenceUsage:  true,
	SilenceErrors: true,
}

func ExecuteContext(ctx context.Context) error {
	return rootCmd.ExecuteContext(ctx)
}

func init() {
	rootCmd.PersistentFlags().StringVar(&cfg.Org, "org", cfg.Org, "GitHub org or owner to manage")
	rootCmd.PersistentFlags().StringVar(&cfg.GravesDir, "graves-dir", cfg.GravesDir, "Folder inside this repo for archived repositories")
	rootCmd.PersistentFlags().IntVar(&cfg.Limit, "limit", 0, "Maximum repositories to fetch from GitHub; 0 means all")
	rootCmd.PersistentFlags().StringVar(&cfg.SSHHostAlias, "ssh-host-alias", cfg.SSHHostAlias, "SSH host alias to use when cloning repositories")
	rootCmd.PersistentFlags().BoolVar(&cfg.DryRun, "dry-run", false, "Print planned operations without changing anything")
	rootCmd.PersistentFlags().BoolVar(&cfg.ClearLocalGraves, "clear-local-graves", cfg.ClearLocalGraves, "Remove the local graves working tree after a successful push")
	rootCmd.PersistentFlags().BoolVarP(&cfg.Yes, "yes", "y", false, "Skip confirmation prompts")
}
