const mongoose = require('mongoose');

const Role = mongoose.model(
    'Role',
    new mongoose.Schema({
        name: String,
    }),
);

module.exports = Role;

// const RoleSchema = new mongoose.Schema({
//     name: {
//         type: String,
//     },
// });

// module.exports = mongoose.model('Role', RoleSchema);
