const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email : {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "user",
        enum:["user", "admin","superadmin",]
    },
    password: {
        type: String,
        required: true
    }
}, 
{ timestamps: true})

module.exports = model('users', UserSchema)