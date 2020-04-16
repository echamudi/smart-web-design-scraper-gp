const jwt = require('jsonwebtoken');
const config = require('../configs/auth.config');
const db = require('../models');

const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        res.status(403).send({ message: 'No token provided!' });
        return;
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            res.status(401).send({ message: 'Unauthorized!' });
            return;
        }
        req.userId = decoded.id;
        next();
    });
};

const isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                for (let i = 0; i < roles.length; i += 1) {
                    if (roles[i].name === 'admin') {
                        next();
                        return;
                    }
                }

                res.status(403).send({ message: 'Require Admin Role!' });
            },
        );
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
};
module.exports = authJwt;
