package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

// rootCmd is the root of all sub commands in the binary
// it doesn't have a Run method as it executes other sub commands
var rootCmd = &cobra.Command{
	Use:   "apiService",
	Short: "apiService is a grpc server to serve microservice demo",
}

func init() {
	rootCmd.AddCommand(srvCmd)
	rootCmd.AddCommand(testCmd)
	rootCmd.AddCommand(proxyCmd)
}

// Execute executes the command
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}