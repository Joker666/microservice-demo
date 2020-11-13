require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const auth = require("./auth");
const messages = require('./proto/service_pb');
const services = require('./proto/service_grpc_pb');

// Mongo Connection
const dbClient = new MongoClient(process.env.DB_URI, { useUnifiedTopology: true });
let db = null;

async function connectDB() {
    try {
        await dbClient.connect();
        db = await dbClient.db(process.env.DB_NAME);
        db.command({ ping: 1 });
        console.log("Connected successfully to mongo server");

        // Create index
        await db.collection("users").createIndex({ email: 1 });
    } catch (e) {
        console.error(e);
    }
}

function register(call, callback) {
    const users = db.collection("users");

    bcrypt.hash(call.request.getPassword(), 10, (err, hash) => {
        let user = { name: call.request.getName(), email: call.request.getEmail(), password: hash }
        users.insertOne(user).then(r => {
            let resp = new messages.UserResponse();
            resp.setId(user._id);
            resp.setName(user.name);
            resp.setEmail(user.email);
            resp.setToken(auth.generateToken(user));
            callback(null, resp);
        });
    });
}

function login(call, callback) {
    const users = db.collection("users");
    users.findOne({ email: call.request.getEmail() }).then(user => {
        bcrypt.compare(call.request.getPassword(), user.password, (err, result) => {
            if (result) {
                let resp = new messages.UserResponse();
                resp.setId(user._id);
                resp.setName(user.name);
                resp.setEmail(user.email);
                resp.setToken(auth.generateToken(user));
                callback(null, resp);
            }
        });
    });
}

function verify(call, callback) {
    auth.verify(call.request.getToken(), (usr) => {
        const users = db.collection("users");
        users.findOne({ email: usr.email }).then(user => {
            let resp = new messages.VerifyResponse();
            resp.setId(user._id);
            resp.setName(user.name);
            resp.setEmail(user.email);
            callback(null, resp);
        })
    })
}

function main() {
    let server = new grpc.Server();
    server.addService(services.UserSvcService, {
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
