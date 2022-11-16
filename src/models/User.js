const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        fullname: {
            type: String,
            require: true,
        },
        age: {
            type: Number,
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', UserSchema);