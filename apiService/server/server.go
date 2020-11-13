package server

import (
	"context"
	pb "github.com/Joker666/microservice-demo/apiService/proto"
)

type Server struct {
	pb.UnimplementedAPIServer
}

// RegisterUser directs to user service register method
func (s *Server) RegisterUser(ctx context.Context, in *pb.RegisterUserRequest) (*pb.UserResponse, error) {
	resp := &pb.UserResponse{
		Id:    "ID",
		Name:  in.GetName(),
		Email: in.GetEmail(),
		Token: in.GetPassword(),
	}
	return resp, nil
}
