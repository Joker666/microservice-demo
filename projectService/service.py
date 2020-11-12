from concurrent import futures
from dotenv import load_dotenv
import logging
import grpc
import api
import os

import proto.service_pb2_grpc as service

load_dotenv(verbose=True)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    address = os.getenv("HOST") + ":" + os.getenv("PORT")
    server.add_insecure_port(address)

    service.add_ProjectSvcServicer_to_server(api.API(), server)

    server.start()
    logging.info("Server started at: http://" + address)
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    serve()
