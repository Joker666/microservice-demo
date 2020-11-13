package cmd

import (
	"context"
	"log"
	"os"
	"time"

	pb "github.com/Joker666/microservice-demo/protos/api"
	"github.com/Joker666/microservice-demo/protos/user"
	"github.com/spf13/cobra"
	"google.golang.org/grpc"
)

// testCmd is the serve sub command to start the api server
var testCmd = &cobra.Command{
	Use:   "testClient",
	Short: "testClient tests the api server",
	RunE:  testClient,
}

func init() {
	//
}

const (
	address     = "localhost:50059"
	defaultName = "world"
)

func testClient(cmd *cobra.Command, args []string) error {
	// Set up a connection to the server.
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewAPIClient(conn)

	// Contact the server and print out its response.
	name := defaultName
	if len(os.Args) > 1 {
		name = os.Args[1]
	}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	r, err := c.RegisterUser(ctx, &user.RegisterRequest{Name: name})
	if err != nil {
		log.Fatalf("could not greet: %v", err)
	}
	log.Printf("Greeting: %s", r.GetName())
	return nil
}
