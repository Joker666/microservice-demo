import proto.service_pb2 as message
import proto.service_pb2_grpc as service
from model import Project, Tag
from datetime import date
from service import session


class API(service.ProjectSvcServicer):

    def createProject(self, request, context):
        project = Project(name=request.name, user_id=request.user_id, created_at=date.today())
        session.add(project)
        session.commit()

        db_project = session.query(Project).filter_by(name=request.name).first()
        return message.ProjectResponse(id=str(db_project.id), name=db_project.name)

    def createTag(self, request, context):
        tag = Tag(name=request.name, project_id=request.project_id, user_id=request.user_id, created_at=date.today())
        session.add(tag)
        session.commit()

        db_tag = session.query(Tag).filter_by(name=request.name, project_id=request.project_id).first()
        return message.TagResponse(id=str(db_tag.id), name=db_tag.name, project_id=str(db_tag.project_id))
