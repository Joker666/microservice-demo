import logging
from service import Base, engine
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Integer, Date, exc, ForeignKey


class Project(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    user_id = Column(String(50))
    created_at = Column(Date)

    def __repr__(self):
        return "<Project(id='%s', name='%s', user_id='%s')>" % (self.id, self.name, self.user_id)


class Tag(Base):
    __tablename__ = 'tags'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    user_id = Column(String(50))
    created_at = Column(Date)

    def __repr__(self):
        return "<Tag(id='%s', name='%s', user_id='%s', project_id='%s')>" % (self.id, self.name, self.user_id, self.project_id)


def create_tables():
    try:
        Project.__table__.create(engine)
    except exc.OperationalError:
        logging.info("Projects table already created")

    try:
        Tag.__table__.create(engine)
    except exc.OperationalError:
        logging.info("Tags table already created")
    Project.tags = relationship(Tag, backref='tags')
