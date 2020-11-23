package server

import (
	"context"
	"log"

	"github.com/Joker666/microservice-demo/apiService/interceptor"
	"github.com/Joker666/microservice-demo/protos/task"

	pb "github.com/Joker666/microservice-demo/protos/api"
	"github.com/Joker666/microservice-demo/protos/project"
	"github.com/Joker666/microservice-demo/protos/user"
)

// Server holds necessary values for server
type Server struct {
	userSvcClient    user.UserSvcClient
	projectSvcClient project.ProjectSvcClient
	taskSvcClient    task.TaskSvcClient
	pb.UnimplementedAPIServer
}

// New returns new instance of Server
func New(userServiceClient user.UserSvcClient, projectServiceClient project.ProjectSvcClient, taskServiceClient task.TaskSvcClient) *Server {
	s := &Server{
		userSvcClient:          userServiceClient,
		projectSvcClient:       projectServiceClient,
		taskSvcClient:          taskServiceClient,
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

// CreateTask creates task
func (s *Server) CreateTask(ctx context.Context, in *task.CreateTaskRequest) (*task.TaskResponse, error) {
	resp := &task.TaskResponse{}
	userID, err := interceptor.GetUserID(ctx)
	if err != nil {
		log.Println("Api: CreateProject", "failed to get user ID", err.Error())
		return resp, err
	}
	in.UserId = userID
	return s.taskSvcClient.CreateTask(ctx, in)
}

// LoginUser directs to user service register method
func (s *Server) LoginUser(ctx context.Context, in *user.LoginRequest) (*user.UserResponse, error) {
	return s.userSvcClient.Login(ctx, in)
}

// GetProject gets detail about projects
func (s *Server) GetProject(ctx context.Context, in *project.GetProjectRequest) (*project.ProjectResponse, error) {
	resp := &project.ProjectResponse{}
	userID, err := interceptor.GetUserID(ctx)
	if err != nil {
		log.Println("Api: CreateProject", "failed to get user ID", err.Error())
		return resp, err
	}
	in.UserId = userID
	return s.projectSvcClient.GetProject(ctx, in)
}

func (s *Server) ListTasks(ctx context.Context, in *task.ListTasksRequest) (*task.ListTasksResponse, error) {
	resp := &task.ListTasksResponse{}
	_, err := interceptor.GetUserID(ctx)
	if err != nil {
		log.Println("Api: CreateProject", "failed to get user ID", err.Error())
		return resp, err
	}
	return s.taskSvcClient.ListTasks(ctx, in)
}