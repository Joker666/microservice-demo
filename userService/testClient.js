const messages = require('./proto/service_pb');
const services = require('./proto/service_grpc_pb');
const grpc = require('@grpc/grpc-js');

function main() {
    const client = new services.UserSvcClient('localhost:8080', grpc.credentials.createInsecure());

    // let registerReq = new messages.RegisterRequest();
    // registerReq.setName("Hello");
    // registerReq.setEmail("hh@hh.com");
    // registerReq.setPassword("Hash");
    // client.register(registerReq, function(err, response) {
    //     console.log(response);
    // });

    let req = new messages.LoginRequest();
    req.setEmail("hh@hh.com");
    req.setPassword("Hash");
    client.login(req, function(err, response) {
        console.log(response);
    });

    // client.verify({token: "token"}, function(err, response) {
    //     console.log(response);
    // });
}

main();
