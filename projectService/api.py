import logging
import proto.project_pb2 as message
import proto.project_pb2_grpc as service
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
        db_project = session.query(Project).filter_by(id=request.project_id).first()
        tag = Tag(name=request.name, project_id=db_project.id, user_id=request.user_id, created_at=date.today())
        session.add(tag)
        session.commit()

        db_tag = session.query(Tag).filter_by(name=request.name, project_id=request.project_id).first()
        return message.TagResponse(id=str(db_tag.id), name=db_tag.name, project_id=str(db_tag.project_id))

    def getProject(self, request, context):
        db_project = session.query(Project).filter_by(id=request.project_id).first()
        db_tags = session.query(Tag).filter_by(project_id=request.project_id).all()

        list_tags_resp = []
        for tag in db_tags:
            tag_message = message.TagResponse(id=str(tag.id), name=tag.name, project_id=str(tag.project_id))
            list_tags_resp.append(tag_message)

        project = message.ProjectResponse(id=str(db_project.id), name=db_project.name, tags=list_tags_resp)
        return project
