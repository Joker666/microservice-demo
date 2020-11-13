package server

import (
	"context"
	pb "github.com/Joker666/microservice-demo/protos/api"
	"github.com/Joker666/microservice-demo/protos/user"
)

type Server struct {
	pb.UnimplementedAPIServer
}

// RegisterUser directs to user service register method
func (s *Server) RegisterUser(ctx context.Context, in *user.RegisterRequest) (*user.UserResponse, error) {
	resp := &user.UserResponse{
		Id:    "ID",
		Name:  in.GetName(),
		Email: in.GetEmail(),
		Token: in.GetPassword(),
	}
	return resp, nil
}
