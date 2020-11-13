## Fix import

https://github.com/protocolbuffers/protobuf/issues/1491

```
sed -i -E 's/^import.*_pb2/from . \0/' *.py
```