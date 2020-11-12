from concurrent import futures
from dotenv import load_dotenv
import logging
import grpc
import os

load_dotenv(verbose=True)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    address = os.getenv("HOST") + ":" + os.getenv("PORT")
    server.add_insecure_port(address)
    server.start()
    print("Server started at: http://" + address)
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    serve()
