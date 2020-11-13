package server

import (
	"context"
	pb "github.com/Joker666/microservice-demo/protos/api"
	"github.com/Joker666/microservice-demo/protos/user"
)

type Server struct {
	userSvcClient user.UserSvcClient
	pb.UnimplementedAPIServer
}

func New(userServiceClient user.UserSvcClient) *Server {
	s := &Server{
		userSvcClient:          userServiceClient,
		UnimplementedAPIServer: pb.UnimplementedAPIServer{},
	}
	return s
}

// RegisterUser directs to user service register method
func (s *Server) RegisterUser(ctx context.Context, in *user.RegisterRequest) (*user.UserResponse, error) {
	return s.userSvcClient.Register(ctx, in)
}
