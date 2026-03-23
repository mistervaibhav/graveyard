package cmd

import (
	"github.com/spf13/cobra"

	"graveyard/internal/graveyard"
)

func init() {
	buryCmd := &cobra.Command{
		Use:   "bury [repo...]",
		Short: "Archive repositories and optionally delete the originals",
		RunE: func(cmd *cobra.Command, args []string) error {
			return graveyard.NewService(cfg).Bury(cmd.Context(), args)
		},
	}

	buryCmd.Flags().BoolVar(&cfg.KeepRemote, "keep-remote", false, "Archive repositories without deleting them from GitHub")
	buryCmd.Flags().BoolVar(&cfg.SelectAll, "all", false, "Select all repositories without opening the interactive picker")

	rootCmd.AddCommand(buryCmd)
}
