const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        required: false
    },
    email : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum:["user", "admin","superadmin",]
    },
}, 
{ timestamps: true})

module.exports = model('users', UserSchema)