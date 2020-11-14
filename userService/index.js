require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const { MongoClient } = require("mongodb");
const services = require('./proto/service_grpc_pb');
const api = require("./api");

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

function main() {
    let server = new grpc.Server();
    server.addService(services.UserSvcService, {
        register: api.register,
        login: api.login,
        verify: api.verify,
    });
    let address = process.env.HOST + ":" + process.env.PORT;
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        connectDB().catch(console.dir);
        console.log("Server running at " + address);
    });
}

main();
