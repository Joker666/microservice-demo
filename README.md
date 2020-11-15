![logo](https://i.imgur.com/KpKFXgP.png)
<h1 align="center">Microservice Demo</h1>

## Table of Contents
- [About the project](#about-the-project)
    - [Motivation](#motivation)
    - [Architecture](#architecture)
    - [Transport Layer](#transport-layer)
- [How to run](#run)

## About the project
A proof of concept demo of how to write microservices in various technologies and how to bind them together to make one seamless application. The project will keep growing as I keep adding newer technologies to it. Contributions are welcome.

### Motivation
If you have not been living under the rock for a while, microservice is the defacto architecture to make large scale applications these days. Lot of companies have moved from monolithic architecture to microservice based architecture.

I have been writing microservices for a while. But I remember having little to no resource on the web for how to stick all the different parts together. I had to struggle a lot and find solutions with trial and error. That's why I started writing this repo to demonstrate programmers how they can get started with microservices.

### Architecture
The project is the world's simplest task management software. A user can register, create projects/tags, add tasks to the projects and tag the tasks into categories. So we have divided the responsibilities into 3 services.
- [User Service](https://github.com/Joker666/microservice-demo/tree/main/userService) written in **NodeJS** with **MongoDB** as data layer. It handles user registration/login and authentication for other services
- [Project Service](https://github.com/Joker666/microservice-demo/tree/main/projectService) written in **Python** with **MySQl** as data layer. It handles project and tags creation and update.
- [Task Service](https://github.com/Joker666/microservice-demo/tree/main/taskService) written in **C#** with **PostgreSQL** as data layer. It handles task creation, add tags to task and assign task to a user
- [API Service](https://github.com/Joker666/microservice-demo/tree/main/apiService) written in **Golang**. This service contains reverse proxy apigateway to transcode HTTP 1.0 requests to/from rpc requests. This also handles routing api calls to all the services.

We have chosen to use monorepo for all the services since it will ease the process for us.

### Transport Layer
GRPC is being used as the transport layer among services. This is the modern approach compared to REST api calls. There are plenty of resources online why this is the better choice for writing microservices. Specially reduced latency for network calls. I plan to write one service using REST api to show how you can communicate between services using REST calls as well.

## How to Run
Since we have used several technologies to make different microservices, you would need few tools installed in your system to run this app. I will detail everything, so that the process is smooth for you.

There are some tools that are required to be installed globally.
- **Docker** - The container management system we are using. You can install docker from https://www.docker.com/
- **Protobuf** - prerequisite to installing GRPC. This is used in GRPC for serializing data instead of JSON that we use in REST api calls. You can install the compiler from https://developers.google.com/protocol-buffers.
- **GRPC** - The transport layer, an RPC framework. You can install GRPC from https://grpc.io/

### Running NodeJS based User Service
This service is written in NodeJS. So, nodejs and npm needs to be installed in the system. We have also used MongoDB as data layer. You can either install MongoDB locally or use docker to run it. You have to update the `.env` file insider `userService` with the MongoDB url to be able to connect to the database. Required tools
- **NodeJS**, along with it npm
- **MongoDB**

After that, run `npm install` from within `userService` directory. Make sure MongoDB is running and the url is updated in `.env`. The required compiled proto files are already in `proto` directory.
Then run the service with `npm run start`

For more information about how to use client to interact with the server, look into the documentation in [User Service](https://github.com/Joker666/microservice-demo/tree/main/userService)

### Running Python based Project Service
This service is written in Python 3.8. So python 3 needs to be installed in the system. We have also used MySQL as data layer. You can either install MySQL locally or use docker to run it. You have to update the `.env` file insider `projectService` with the MongoDB url to be able to connect to the database. We have used `SQLAlchemy` as ORM to access the database.

In python world, it is common to use dedicated environment per project to not pollute the global python environment. Here, we are using `pipenv` to manage dependencies and virtual environment. You do not have to use it if you do not want to, we have included `requirements.txt` as well which is generated using `pipenv lock -r > requirements.txt`. Required tools
- **Python 3.8**
- **Pipenv**
- **MySQL**

After that, run `pipenv install`, if you are using `pipenv`, from within `projectService` directory. If you are not using `pipenv` run 
`pip install -r requirements.txt`. Make sure MySQL is running and the url is updated in `.env`. The required compiled proto files are already in `proto` directory.
If you are not already inside the virtual environment, activate it with `pipenv shell`(only required if you are using `pipenv`). Then run the service with `python service.py` or `python3 service.py`

For more information about how to use client to interact with the server, look into the documentation in [Project Service](https://github.com/Joker666/microservice-demo/tree/main/projectService)

### Running Golang based API Service
This service the the gateway to all the other services. To run this service, you need to make sure all other services are running properly. This service is written in Go 1.15, and you need to make sure it is installed in the system with `GOROOT` and `GOPATH` configured. Required tools
- **Go 1.15**

I have added convenient `build.sh` the creates the binary and `run.sh` that runs the service. The required protos are imported from outside `protos` folder which is also a go package. Keeping all services' proto files here, we could make it a go package and import them in api service. More information in [API Service](https://github.com/Joker666/microservice-demo/tree/main/apiService)

#### Running the Golang based Proxy Server
The proxy server is inside `apiService`. This helps us transcode HTTP 1.0 requests to from rpc requests. So that we can use tools like Postman to hit endpoints in this application. If you are using GRPC-Web, you do not need this. But I doubt about it's widespread usage. Required tools
- **GRPC-Gateway**

After running `build.sh`, run `$GOPATH/bin/apiService proxy` to start the proxy server. Make sure api service GRPC server is running already.

### Running everything using Docker-Compose
You can either run each service separately and then interact with the application or use docker-compose to run all of them at once and remove complexity.
