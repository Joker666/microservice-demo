#!/bin/bash

set -e

grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:userService/proto/ \
    --grpc_out=grpc_js:userService/proto \
    --proto_path=./protos/user ./protos/user/*.proto

python -m grpc_tools.protoc \
    --python_out=./projectService/proto \
    --grpc_python_out=./projectService/proto \
    --proto_path=./protos/project ./protos/project/*.proto


pushd projectService/proto
sed -i -E 's/^import.*_pb2/from . \0/' *.py
popd

pushd projectService
pipenv lock -r > requirements.txt
popd


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