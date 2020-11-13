package cmd

import (
	gw "github.com/Joker666/microservice-demo/apiService/proto"
	"github.com/joho/godotenv"
	"log"
	"os"

	"context"
	"flag"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/spf13/cobra"
	"google.golang.org/grpc"
	"net/http"
)

// proxyCmd is the serve sub command to start the api server
var proxyCmd = &cobra.Command{
	Use:   "proxy",
	Short: "proxy tests the api server",
	RunE:  proxy,
}

func init() {
	//
}

func proxy(cmd *cobra.Command, args []string) error {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	grpcServerAddress := os.Getenv("HOST") + ":" + os.Getenv("PORT")
	proxyPort := ":" + os.Getenv("PROXY_PORT")

	grpcServerEndpoint := flag.String("grpc-server-endpoint",  grpcServerAddress, "gRPC server endpoint")

	// Register gRPC server endpoint
	// Note: Make sure the gRPC server is running properly and accessible
	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithInsecure()}
	err = gw.RegisterAPIHandlerFromEndpoint(ctx, mux, *grpcServerEndpoint, opts)
	if err != nil {
		return err
	}

	log.Println("Starting proxy server at " + proxyPort)
	// Start HTTP server (and proxy calls to gRPC server endpoint)
	return http.ListenAndServe(proxyPort, mux)
}
