[![License](https://img.shields.io/badge/license-SATA-blue)](https://github.com/Joker666/microservice-demo/blob/master/LICENSE)

![logo](https://i.imgur.com/KpKFXgP.png)
<h1 align="center">Microservice Demo</h1>

## Table of Contents
- [About the project](#about-the-project)
    - [Motivation](#motivation)
    - [Features](#features)
    - [Architecture](#architecture)
    - [Transport Layer](#transport-layer)
- [How to run](#how-to-run)
    - [User Service](#running-nodejs-based-user-service)
    - [Project Service](#running-python-based-project-service)
    - [API Service](#running-golang-based-api-service)
    - [Run Everything](#running-everything-using-docker-compose)
- [Roadmap](#roadmap)
- [Contribution](#contribution)
- [License](#license)

## About the project
A proof of concept demo of how to write microservices in various technologies and how to bind them together to make one seamless application. The project will keep growing as I keep adding newer technologies to it. Contributions are welcome.

### Motivation
If you have not been living under the rock for a while, microservice is the defacto architecture to make large scale applications these days. Lot of companies have moved from monolithic architecture to microservice based architecture.

I have been writing microservices for a while. But I remember having little to no resource on the web for how to stick all the different parts together. I had to struggle a lot and find solutions with trial and error. That's why I started writing this repo to demonstrate programmers how they can get started with microservices.

### Features
- **Multiple Stacks**: The application is designed with multiple software stacks. Different services use different languages and databases to demonstration how to build a microservice based application with languages or tools that serve the best purpose for that service
- **GRPC**: The services communicate with each other using GRPC framework to reduce latency in network calls
- **Docker**: Each service has it's own dockerfile on how to run the service as standalone and docker-compose to run all at once
- **API Gateway**: This application has api gateway service which can route api calls to desired services
- **Proxy Server**: It also comes with a proxy server built with GRPC Gateway to handle HTTP 1.0 requests so that the app can be tested with tools like Postman
- **JWT Authentication**: This also showcases how you can secure a service with authentication middleware

### Architecture
The project is the world's simplest task management software. A user can register, create projects/tags, add tasks to the projects and tag the tasks into categories. So we have divided the responsibilities into 3 services.

| Service                                                      | Technologies    | Description                                                  |
| ------------------------------------------------------------ | --------------- | :----------------------------------------------------------- |
| [User Service](https://github.com/Joker666/microservice-demo/tree/main/userService) | NodeJS, MongoDB | It handles user registration/login and authentication for other services |
| [Project Service](https://github.com/Joker666/microservice-demo/tree/main/projectService) | Python, MySQL   | It handles project and tags creation and update              |
| [Task Service](https://github.com/Joker666/microservice-demo/tree/main/taskService) | Ruby, PostgreSQL  | It handles task creation, add tags to task and assign task to a user |
| [API Service](https://github.com/Joker666/microservice-demo/tree/main/apiService) | Go              | It handles routing api calls to all the services and a proxy server to handle HTTP 1.0 requests |

We have chosen to use monorepo for all the services since it will ease the process for us.

### Transport Layer
GRPC is being used as the transport layer among services. This is the modern approach compared to REST api calls. There are plenty of resources online why this is the better choice for writing microservices. Specially reduced latency for network calls. I plan to write one service using REST api to show how you can communicate between services using REST calls as well.

## How to Run
Since we have used several technologies to make different microservices, you would need few tools installed in your system to run this app. I will detail everything, so that the process is smooth for you.

You can skip to [Run Everything](#running-everything-using-docker-compose) to run all the services without going through the steps of how to run individual services.

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

After that, if you are using `pipenv` run `pipenv install`, from within `projectService` directory. If you are not using `pipenv` run 
`pip install -r requirements.txt`. Make sure MySQL is running and the url is updated in `.env`. The required compiled proto files are already in `proto` directory.
If you are not already inside the virtual environment, activate it with `pipenv shell`(only required if you are using `pipenv`). Then run the service with `python service.py` or `python3 service.py`

For more information about how to use client to interact with the server, look into the documentation in [Project Service](https://github.com/Joker666/microservice-demo/tree/main/projectService)

### Running Golang based API Service
This service the the gateway to all the other services. To run this service, you need to make sure all other services are running properly. This service is written in Go 1.15, and you need to make sure it is installed in the system with `GOROOT` and `GOPATH` configured. Required tools
- **Go 1.15**

I have added convenient `build.sh` the creates the binary and `run.sh` that runs the service. The required protos are imported from outside `protos` folder which is also a go package. Keeping all services' proto files here, we could make it a go package and import them in api service. More information in [API Service](https://github.com/Joker666/microservice-demo/tree/main/apiService)

#### Running the Golang based Proxy Server
The proxy server is inside `apiService`. This helps us transcode HTTP 1.0 requests to from rpc requests. So that we can use tools like Postman to hit endpoints in this application. If you are using GRPC-Web, you do not need this. But I doubt about it's widespread usage. Required tools
- **GRPC-Gateway**, you do not need to explicitly install it, it is being taken care of with `build.sh`

After running `build.sh`, run `$GOPATH/bin/apiService proxy` to start the proxy server. Make sure api service GRPC server is running already.

### Running everything using Docker-Compose
You can either run each service separately and then interact with the application or use docker-compose to run all of them at once and remove complexity. You do not need anything other than **Docker** installed in the system. Just run
```docker-compose.yml up --build```
and it will spin up all the services. If it fails for some reason due to MySQL/MongoDB creating database for the first time, run again. After a few minutes if you `docker ps`, you should see

![List of services](https://i.imgur.com/qtaHZC9.png)

And now you have a set of microservices running that you can access with the proxy server's url `localhost:9090`

## Roadmap
- Write development docs
- Add task service
- Add a HTTP 1.0 service
- Add helm charts and run in Kubernetes cluster
- Add monitoring
- Add tracing
- Add service mesh

## Contribution
Want to contribute? Great!

To fix a bug or enhance an existing module, follow these steps:

- Fork the repo
- Create a new branch (`git checkout -b improve-feature`)
- Make the appropriate changes in the files
- Add changes to reflect the changes made
- Commit your changes (`git commit -am 'Improve feature'`)
- Push to the branch (`git push origin improve-feature`)
- Create a Pull Request 

### Bug / Feature Request
If you find a bug, kindly open an issue [here](https://github.com/Joker666/microservice-demo/issues/new).<br/>
If you'd like to request/add a new function, feel free to do so by opening an issue [here](https://github.com/Joker666/microservice-demo/issues/new). 

## See Also
- https://github.com/GoogleCloudPlatform/microservices-demo
- https://github.com/microservices-demo/microservices-demo

## [License](https://github.com/Joker666/microservice-demo/blob/master/LICENSE.md)

MIT © [MD Ahad Hasan](https://github.com/joker666)
