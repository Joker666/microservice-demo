package server

import (
	"context"
	"github.com/Joker666/microservice-demo/apiService/interceptor"
	"log"

	pb "github.com/Joker666/microservice-demo/protos/api"
	"github.com/Joker666/microservice-demo/protos/project"
	"github.com/Joker666/microservice-demo/protos/user"
)

// Server holds necessary values for server
type Server struct {
	userSvcClient    user.UserSvcClient
	projectSvcClient project.ProjectSvcClient
	pb.UnimplementedAPIServer
}

// New returns new instance of Server
func New(userServiceClient user.UserSvcClient, projectSvcClient project.ProjectSvcClient) *Server {
	s := &Server{
		userSvcClient:          userServiceClient,
		projectSvcClient:       projectSvcClient,
		UnimplementedAPIServer: pb.UnimplementedAPIServer{},
	}
	return s
}

// RegisterUser directs to user service register method
func (s *Server) RegisterUser(ctx context.Context, in *user.RegisterRequest) (*user.UserResponse, error) {
	return s.userSvcClient.Register(ctx, in)
}

// CreateProject creates project for user
func (s *Server) CreateProject(ctx context.Context, in *project.CreateProjectRequest) (*project.ProjectResponse, error) {
	resp := &project.ProjectResponse{}
	userID, err := interceptor.GetUserID(ctx)
	if err != nil {
		log.Println("Api: CreateProject", "failed to get user ID", err.Error())
		return resp, err
	}
	in.UserId = userID
	return s.projectSvcClient.CreateProject(ctx, in)
}
