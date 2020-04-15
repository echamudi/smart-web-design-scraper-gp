const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

// const User = mongoose.model(
//     'User',
//     new mongoose.Schema({
//         username: String,
//         email: String,
//         password: String,
//         roles: [
//             {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Role',
//             },
//         ],
//     }),
// );

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


// UserSchema.pre('save', (next) => {
//     const user = this;

//     if (!user.isModified('password')) {
//         next();
//     }

//     bcrypt.hash(user.password, 8)
//         .then((hash) => {
//             user.password = hash;
//             next();
//         })
//         .catch((err) => next(err));
// });


module.exports = mongoose.model('User', UserSchema);
