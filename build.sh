#! /bin/sh

set -e

python -m grpc_tools.protoc --proto_path=./protos/project \
        --python_out=./projectService/proto \
        --grpc_python_out=./projectService/proto ./protos/project/*.proto