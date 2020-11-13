#!/bin/bash

set -e

python -m grpc_tools.protoc --proto_path=./protos/project \
        --python_out=./projectService/proto \
        --grpc_python_out=./projectService/proto ./protos/project/*.proto


packs=(
    "api"
    "user"
    "project"
);

for d in ${packs[@]} ; do
    echo "Compiling $d";
    protoc -I . -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
            -I protos \
            --go_out=. --go_opt=paths=source_relative \
            --go-grpc_out=. --go-grpc_opt=paths=source_relative \
            protos/$d/*.proto
done

protoc -I . -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
    -I protos \
    --grpc-gateway_out . \
    --grpc-gateway_opt logtostderr=true \
    --grpc-gateway_opt paths=source_relative \
    protos/api/api.proto