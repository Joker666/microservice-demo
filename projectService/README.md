## Generate proto

```
python -m grpc_tools.protoc --proto_path=./proto/ --python_out=./proto/ --grpc_python_out=./proto/ ./proto/*.proto
```

## Fix import

https://github.com/protocolbuffers/protobuf/issues/1491

```
sed -i -E 's/^import.*_pb2/from . \0/' *.py
```