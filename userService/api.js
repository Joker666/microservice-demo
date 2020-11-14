const bcrypt = require('bcrypt');
const auth = require("./auth");
const messages = require('./proto/service_pb');

module.exports.register = (call, callback) => {
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

module.exports.login = (call, callback) => {
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

module.exports.verify = (call, callback) => {
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
