#!/bin/bash

set -e

# Build the user service protos for Node
grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:userService/proto/ \
    --grpc_out=grpc_js:userService/proto \
    --proto_path=./protos/user ./protos/user/*.proto

# Build the project service protos for Python
python -m grpc_tools.protoc \
    --python_out=./projectService/proto \
    --grpc_python_out=./projectService/proto \
    --proto_path=./protos/project ./protos/project/*.proto

# Build the task/project/user service protos for Ruby
grpc_tools_ruby_protoc \
    --proto_path=./protos \
    --ruby_out=./taskService/proto \
    --grpc_out=./taskService/proto \
    ./protos/task/*.proto ./protos/user/*.proto ./protos/project/*.proto


# Fix python import 
# https://github.com/protocolbuffers/protobuf/issues/1491
pushd projectService/proto
sed -i -E 's/^import.*_pb2/from . \0/' *.py
popd

# Generate requirements.txt for python project
pushd projectService
pipenv lock -r > requirements.txt
popd


packs=(
    "api"
    "user"
    "project"
    "task"
);

# Generate go protobuf files for all protos
for d in ${packs[@]} ; do
    echo "Compiling $d";
    protoc -I . -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
            -I protos \
            --go_out=. --go_opt=paths=source_relative \
            --go-grpc_out=. --go-grpc_opt=paths=source_relative \
            protos/$d/*.proto
done

# Generate api definition with GRPC Gateway
protoc -I . -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
    -I protos \
    --grpc-gateway_out . \
    --grpc-gateway_opt logtostderr=true \
    --grpc-gateway_opt paths=source_relative \
    protos/api/api.proto

# Genrate swagger docs with GRPC Gateway
protoc -I . -I . -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
    -I protos \
    --openapiv2_out . \
    --openapiv2_opt logtostderr=true \
    protos/api/api.proto

# Move the swagger json to api service www folder
mv protos/api/api.swagger.json apiService/www