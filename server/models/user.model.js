const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,

        // unique option is not a validator
        // we use mongoose-unique-validator to enforce it
        unique: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
        },
    ],
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
