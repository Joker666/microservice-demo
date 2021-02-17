package cmd

import (
	gw "github.com/Joker666/microservice-demo/protos/api"
	"github.com/joho/godotenv"
	"log"
	"os"

	"context"
	"flag"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/rs/cors"
	"github.com/spf13/cobra"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/proto"
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

	// Register gRPC server endpoint
	// Note: Make sure the gRPC server is running properly and accessible
	mux := http.NewServeMux()
	g, err := newGateway(ctx)
	if err != nil {
		return err
	}
	mux.Handle("/", g)

	mux.HandleFunc("/swagger.json", serveSwagger)
	fs := http.FileServer(http.Dir("www/swagger-ui"))
	mux.Handle("/swagger-ui/", http.StripPrefix("/swagger-ui", fs))

	proxyPort := ":" + os.Getenv("PROXY_PORT")
	log.Println("Starting proxy server at " + proxyPort)
	// Start HTTP server (and proxy calls to gRPC server endpoint)
	return http.ListenAndServe(proxyPort, mux)
}

func newGateway(ctx context.Context) (http.Handler, error) {
	grpcServerAddress := os.Getenv("HOST") + ":" + os.Getenv("PORT")
	grpcServerEndpoint := flag.String("grpc-server-endpoint",  grpcServerAddress, "gRPC server endpoint")
	//add specific headers to handle CORS in new instance of ServeMux
	//mux := runtime.NewServeMux(runtime.WithForwardResponseOption(httpResponseModifier))
	mux := runtime.NewServeMux()
	handler := cors.Default().Handler(mux)
	opts := []grpc.DialOption{grpc.WithInsecure()}
	err := gw.RegisterAPIHandlerFromEndpoint(ctx, mux, *grpcServerEndpoint, opts)
	if err != nil {
		return nil, err
	}
	return handler, nil
}

//Modifier to append CORS headers
func httpResponseModifier(ctx context.Context, w http.ResponseWriter, _ proto.Message) error {
	setDefaultHeaders(w)

	return nil
}

//CORS specific headers - these values are only for dev, for prod the allow origin needs to be narrowed down
func setDefaultHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, post-check=0, pre-check=0")
	w.Header().Set("Content-Type", "application/json; charset=UTF-8; application/x-www-form-urlencoded")
	w.Header().Set("Vary", "Accept-Encoding")
	w.Header().Set("Access-Control-Max-Age", "3600")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")
	w.Header().Set("Access-Control-Expose-Headers", "responseType")
	w.Header().Set("Access-Control-Expose-Headers", "observe")
	w.WriteHeader(http.StatusOK)
}

func serveSwagger(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "www/api.swagger.json")
}
