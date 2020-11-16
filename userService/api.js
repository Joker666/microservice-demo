const bcrypt = require('bcrypt');
const auth = require("./auth");
const messages = require('./proto/service_pb');


module.exports = class API {
    constructor(db, grpc) {
        this.db = db;
        this.grpc = grpc;
    }

    register = (call, callback) => {
        const users = this.db.collection("users");

        bcrypt.hash(call.request.getPassword(), 10, (err, hash) => {
            let user = { name: call.request.getName(), email: call.request.getEmail(), password: hash }
            users.insertOne(user).then(r => {
                let resp = new messages.UserResponse();
                resp.setId(user._id.toString());
                resp.setName(user.name);
                resp.setEmail(user.email);
                resp.setToken(auth.generateToken(user));
                callback(null, resp);
            });
        });
    }

    login = (call, callback) => {
        const users = this.db.collection("users");

        users.findOne({ email: call.request.getEmail() }).then(user => {
            if (user) {
                bcrypt.compare(call.request.getPassword(), user.password, (err, result) => {
                    if (result) {
                        let resp = new messages.UserResponse();
                        resp.setId(user._id.toString());
                        resp.setName(user.name);
                        resp.setEmail(user.email);
                        resp.setToken(auth.generateToken(user));
                        callback(null, resp);
                    }
                });
            } else {
                return callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: "No user found",
                });
            }
        });
    }

    verify = (call, callback) => {
        auth.verify(call.request.getToken(), (usr) => {
            const users = this.db.collection("users");

            let resp = new messages.VerifyResponse();
            if (usr) {
                users.findOne({ email: usr.email }).then(user => {
                    resp.setId(user._id.toString());
                    resp.setName(user.name);
                    resp.setEmail(user.email);
                    callback(null, resp);
                })
            } else {
                return callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: "No user found",
                });
            }
        })
    }
};
