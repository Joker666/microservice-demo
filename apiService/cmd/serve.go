package cmd

import (
	"github.com/Joker666/microservice-demo/apiService/interceptor"
	"github.com/Joker666/microservice-demo/apiService/server"
	pb "github.com/Joker666/microservice-demo/protos/api"
	"github.com/Joker666/microservice-demo/protos/project"
	"github.com/Joker666/microservice-demo/protos/user"
	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"

	"log"
	"net"
	"os"

	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
	"google.golang.org/grpc"
)

// srvCmd is the serve sub command to start the api server
var srvCmd = &cobra.Command{
	Use:   "serve",
	Short: "serve serves the api server",
	RunE:  serve,
}

func init() {
	//
}

func serve(cmd *cobra.Command, args []string) error {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port := ":" + os.Getenv("PORT")
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	userAddress := os.Getenv("USER_HOST") + ":" + os.Getenv("USER_PORT")
	log.Println("Connecting to user service on " + userAddress)
	userConn, err := grpc.Dial(userAddress, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer userConn.Close()
	userSvcClient := user.NewUserSvcClient(userConn)

	projectAddress := os.Getenv("PROJECT_HOST") + ":" + os.Getenv("PROJECT_PORT")
	log.Println("Connecting to project service on " + projectAddress)
	projectConn, err := grpc.Dial(projectAddress, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer projectConn.Close()
	projectSvcClient := project.NewProjectSvcClient(projectConn)

	unaryInterceptors := []grpc.UnaryServerInterceptor{
		interceptor.UnaryAuthenticate(userSvcClient),
	}
	s := grpc.NewServer(grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(unaryInterceptors...)))
	pb.RegisterAPIServer(s, server.New(userSvcClient, projectSvcClient))

	log.Println("Starting GRPC server at: " + port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
	return nil
}
