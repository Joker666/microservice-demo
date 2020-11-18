const messages = require('./proto/user_pb');
const services = require('./proto/user_grpc_pb');
const grpc = require('@grpc/grpc-js');

function main() {
    const client = new services.UserSvcClient('localhost:8080', grpc.credentials.createInsecure());

    let registerReq = new messages.RegisterRequest();
    registerReq.setName("Hello");
    registerReq.setEmail("hh@hh.com");
    registerReq.setPassword("Hash");
    client.register(registerReq, function(err, response) {
        console.log(response);
    });

    let req = new messages.LoginRequest();
    req.setEmail("hh@hh.com");
    req.setPassword("Hash");
    client.login(req, function(err, response) {
        console.log(response);
    });

    let req = new messages.VerifyRequest();
    req.setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV29ybGQiLCJlbWFpbCI6ImhlbGxvQHdvcmxka3Nrc3MuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkYzJFeDl0LzNvMWx2aWMwbTZZb0E5TzFTNE9xTnp6OU1rdkdiajVwbFhSWU1MaUd4LmlwUXUiLCJfaWQiOiI1ZmFmY2Q2MGM0YmY3MzUwMjJmNDQ0YTciLCJpYXQiOjE2MDUzNTY4OTYsImV4cCI6MTYwNTM5Mjg5Nn0.3kZEol2wJNK6FgsF9kEzAQyojqd9RwMECEZ2B9Hc-hM");
    client.verify(req, function(err, response) {
        if (err) {
            console.error(err);
        }
        console.log(response);
    });

    let req = new messages.GetUserRequest();
    req.setUserId("5fafcd09a257e20ad860a392");
    client.getUser(req, function(err, response) {
        if (err) {
            console.error(err);
        }
        console.log(response);
    });
}

main();
