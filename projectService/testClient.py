import proto.project_pb2 as message
import proto.project_pb2_grpc as service

import logging
import grpc


def run():
    with grpc.insecure_channel('localhost:8081') as channel:
        stub = service.ProjectSvcStub(channel)
        response = stub.getProject(message.GetProjectRequest(user_id="5fafcd60c4bf735022f444a7", project_id="6"))
        # response = stub.createProject(message.CreateProjectRequest(user_id="5fafcd60c4bf735022f444a7", name="Hello"))
        # response = stub.createTag(message.CreateTagRequest(user_id="5fafcd60c4bf735022f444a7", name="HelloTag", project_id="6"))
    print(response)


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    run()
