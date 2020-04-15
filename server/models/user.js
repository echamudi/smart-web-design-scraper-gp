const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const Session = require('./session');


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true, // note that the unique option is not a validator; we use mongoose-unique-validator to enforce it
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
});

UserSchema.plugin(uniqueValidator);


UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    // we generate the salt using 12 rounds and then use that salt with the received password string to generate our hash
    bcrypt
        .genSalt(12)
        .then((salt) => bcrypt.hash(user.password, salt))
        .then((hash) => {
            user.password = hash;
            next();
        })
        .catch((err) => next(err));
});


module.exports = mongoose.model('User', UserSchema);
