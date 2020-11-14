![logo](https://i.imgur.com/KpKFXgP.png)
<h1 align="center">Microservice Demo</h1>

## Table of Contents
- [About the project](#about-the-project)
    - [Motivation](#motivation)
    - [Architecture](#architecture)
    - [Transport Layer](#transport-layer)
- [How to run](#run)

## About the project
A proof of concept demo of how to write microservices in various technologies and how to bind them together to make one seemless application. The project will keep growing as I keep adding newer technologies to it. Contributions are welcome.

### Motivation
If you have not been living under the rock for a while, microservice is the defacto architecure to make large scale applications these days. Lot of companies have moved from monolithic architecure to microservice based architecture.

I have been writing microservices for a while. But I remember having little to no resource on the web for how to stick all the different parts together. I had to struggle a lot and find solutions with trial and error. That's why I started writing this repo to demonstrate programmers how they can get started with microservices.

### Architecture
The project is the world's simplest task management software. A user can register, create projects/tags, add tasks to the projects and tag the tasks into categories. So we have divided the responsiblities into 3 services.
- [User Service](https://github.com/Joker666/microservice-demo/tree/main/userService) written in **NodeJS** with **MongoDB** as data layer. It handles user registraion/login and authentication for other services
- [Project Service](https://github.com/Joker666/microservice-demo/tree/main/projectService) written in **Python** with **MySQl** as data layer. It handles project and tags creation and update.
- [Task Service](https://github.com/Joker666/microservice-demo/tree/main/taskService) written in **C#** with **PostgreSQl** as data layer. It handles task creation, add tags to task and assign task to a user
- [API Service](https://github.com/Joker666/microservice-demo/tree/main/apiService) written in **Golang**. This service contains reverse proxy apigateway to transcode HTTP 1.0 requests to/from rpc to requests. This also handles routing service calls to all the services.

### Transport Layer
GRPC is being used as the transport layer among services. This is the modern approach compared to REST api calls. There are plenty of resources online why this is the better choice for writing microservices. Specially reduced latency for network calls. I plan to write one service using REST api to show how you can communicate between services using REST calls as well.
