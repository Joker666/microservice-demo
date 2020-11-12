import proto.service_pb2 as message
import proto.service_pb2_grpc as service

import logging
import grpc


def run():
    with grpc.insecure_channel('localhost:50052') as channel:
        stub = service.ProjectSvcStub(channel)
        response = stub.createProject(message.CreateProjectRequest(user_id="1", name="Hello"))
    print("Greeter client received: " + response.name)


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    run()
