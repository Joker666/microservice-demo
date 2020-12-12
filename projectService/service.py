import logging
import os
import time
from concurrent import futures

import grpc
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import api
import model
import proto.project_pb2_grpc as service

load_dotenv(verbose=True)

engine = create_engine(os.getenv("DB_URI"), echo=False)
i = 0


def connect_db():
    global i
    if i > 10:
        quit()
    try:
        conn = engine.connect()
    except OperationalError:
        time.sleep(1)
        i = i + 1
        connect_db()


connect_db()
Session = sessionmaker(bind=engine)
session = Session()
Base = declarative_base()


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    address = os.getenv("HOST") + ":" + os.getenv("PORT")
    server.add_insecure_port(address)

    model.create_tables()

    service.add_ProjectSvcServicer_to_server(api.API(), server)

    server.start()
    logging.info("Server started at: http://" + address)
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    serve()
