import proto.service_pb2 as message
import proto.service_pb2_grpc as service


class API(service.ProjectSvcServicer):

    def createProject(self, request, context):
        print(request)
        return message.ProjectResponse(id="1", name=request.name)

    def createTag(self, request, context):
        print(request)
        return message.TagResponse(id="1", name="World", project_id="2")
