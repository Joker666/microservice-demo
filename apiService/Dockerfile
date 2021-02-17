FROM golang:1.15 AS builder

# Set GOPATH to build Go app
ENV GOPATH=/go

# Set apps source directory
ENV SRC_DIR=${GOPATH}/src/github.com/Joker666/microservice-demo/

# Define current working directory
WORKDIR ${SRC_DIR}

# Copy apps scource code to the image
COPY . ${SRC_DIR}

# Build App
#the commented lines below are for when you are using windows machine

#RUN apt-get update && apt-get install -y dos2unix
#COPY /build.sh ${SRC_DIR}/buildNew.sh
#RUN dos2unix ${SRC_DIR}/buildNew.sh && apt-get --purge remove -y dos2unix && rm -rf /var/lib/apt/lists/*

#on linux based machines the below command will do
RUN ./build.sh

EXPOSE 50059
ENTRYPOINT [ "apiService" ]
