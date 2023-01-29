package verify

import (
	"log"

	"github.com/cncf/landscape/pkg/verify"
	"github.com/spf13/cobra"
)

var Cmd = &cobra.Command{
	Use:   "verify",
	Short: "Verifies the landscape.yml file against a schema.",
	Long:  "erifies that the landscape.yaml file exists and that it's contents can be marshaled as yaml.",
	Args:  cobra.OnlyValidArgs,
	RunE:  run,
}

var args struct {
	file string
}

func init() {
	flags := Cmd.Flags()

	flags.StringVar(
		&args.file,
		"file",
		"landscape.yml",
		"File to validate.",
	)

	Cmd.RegisterFlagCompletionFunc("output-format", func(cmd *cobra.Command, args []string, toComplete string) ([]string, cobra.ShellCompDirective) {
		return []string{"yml", "yaml"}, cobra.ShellCompDirectiveDefault
	})
}

func run(cmd *cobra.Command, argv []string) error {
	if err := verify.Verify(args.file); err != nil {
		return err
	}
	log.Println("Landscape validated")
	return nil
}
