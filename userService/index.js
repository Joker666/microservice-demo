const PROTO_PATH = __dirname + '/proto/service.proto';
require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const auth = require("./auth");

// Proto config
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true, longs: String, enums: String, defaults: true, oneofs: true
});

const userProto = grpc.loadPackageDefinition(packageDefinition).demo_user;

// Mongo Connection
const dbClient = new MongoClient(process.env.DB_URI, { useUnifiedTopology: true });
let db = null;

async function connectDB() {
    try {
        await dbClient.connect();
        db = await dbClient.db(process.env.DB_NAME);
        db.command({ ping: 1 });
        console.log("Connected successfully to mongo server");
    } catch (e) {
        console.error(e);
    }
}

function register(call, callback) {
    const users = db.collection("users");

    bcrypt.hash(call.request.password, 10, (err, hash) => {
        let user = { name: call.request.name, email: call.request.email, password: hash }
        users.insertOne(user).then(r => {
            callback(null, {id: user._id, name: user.name, email: user.email, token: auth.generateToken(user)});
        });
    });
}

function login(call, callback) {
    const users = db.collection("users");

    users.findOne({ email: call.request.email }).then(user => {
        bcrypt.compare(call.request.password, user.password, (err, result) => {
            if (result) {
                callback(null, {id: user._id, name: user.name, email: user.email, token: auth.generateToken(user)});
            }
        });
    });
}

function verify(call, callback) {
    auth.verify(call.request.token, (usr) => {
        const users = db.collection("users");
        users.findOne({ email: usr.email }).then(user => {
            console.log(user);
            callback(null, {id: user._id, name: user.name, email: user.email});
        })
    })
}

function main() {
    let server = new grpc.Server();
    server.addService(userProto.UserSvc.service, {
        register: register,
        login: login,
        verify: verify,
    });
    let address = process.env.HOST + ":" + process.env.PORT;
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        connectDB().catch(console.dir);
        console.log("Server running at " + address);
    });
}

main();
