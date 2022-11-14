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
        fullName: {
            type: String,
        },
        age: {
            type: Number,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', UserSchema);