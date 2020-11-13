const messages = require('./proto/service_pb');
const services = require('./proto/service_grpc_pb');
const grpc = require('@grpc/grpc-js');

function main() {
    const client = new services.UserSvcClient('localhost:50051', grpc.credentials.createInsecure());
    // client.register({name: "Tesla", email: "hh@hh.com", password: "Hash"}, function(err, response) {
    //     console.log(response);
    // });

    let req = new messages.LoginRequest();
    req.setEmail("hh@hh.com");
    req.setPassword("Hash");
    console.log(req);
    client.login(req, function(err, response) {
        console.log(response);
    });

    // client.verify({token: "token"}, function(err, response) {
    //     console.log(response);
    // });
}

main();
