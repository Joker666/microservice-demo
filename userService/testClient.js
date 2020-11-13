const PROTO_PATH = __dirname + '/../protos/user/service.proto';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const userProto = grpc.loadPackageDefinition(packageDefinition).demo_user;

function main() {
    const client = new userProto.UserSvc('localhost:50051', grpc.credentials.createInsecure());
    client.register({name: "Tesla", email: "hh@hh.com", password: "Hash"}, function(err, response) {
        console.log(response);
    });

    client.login({email: "hh@hh.com", password: "Hash"}, function(err, response) {
        console.log(response);
    });

    client.verify({token: "token"}, function(err, response) {
        console.log(response);
    });
}

main();
