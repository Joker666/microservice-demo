package interceptor

import (
	"context"
	"github.com/Joker666/microservice-demo/protos/user"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/grpclog"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"strings"
	"time"
)

const (
	KeyUserID     = "user_id"
)

func needAuthenticate(url string) bool {
	safeUrls := []string{
		"/demo_api.API/RegisterUser",
	}

	for _, u := range safeUrls {
		if strings.HasPrefix(url, u) {
			return false
		}
	}

	return true
}

// UnaryAuthenticate handles authentication
func UnaryAuthenticate(userClient user.UserSvcClient) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		start := time.Now()
		if needAuthenticate(info.FullMethod) {
			userID, err := authenticate(ctx, userClient)
			if err != nil {
				return nil, err
			}
			ctx = context.WithValue(ctx, KeyUserID, userID)
		}
		h, err := handler(ctx, req)
		grpclog.Infof("Request - Method:%s\tDuration:%s\tError:%v\n", info.FullMethod, time.Since(start), err)
		return h, err
	}
}

func authenticate(ctx context.Context, userClient user.UserSvcClient) (string, error) {
	token, err := getAuthFromContext(ctx)
	if err != nil {
		return "", err
	}
	// validateToken function validates the token
	req := user.VerifyRequest{Token: token}
	resp, err := userClient.Verify(ctx, &req)
	if err != nil {
		return "", status.Errorf(codes.Unauthenticated, err.Error())
	}
	return resp.Id, nil
}

func getAuthFromContext(ctx context.Context) (string, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return "", status.Errorf(codes.InvalidArgument, "Retrieving metadata is failed")
	}
	authHeader, ok := md["authorization"]
	if !ok {
		return "", status.Errorf(codes.Unauthenticated, "Authorization token is not supplied")
	}
	bearerToken := strings.Split(authHeader[0], " ")
	return bearerToken[1], nil
}

// GetUserID retrieves user id from context
func GetUserID(ctx context.Context) (string, error) {
	email := ctx.Value(KeyUserID)
	if email == nil {
		return "", status.Errorf(codes.NotFound, "User ID is not supplied")
	}
	return email.(string), nil
}