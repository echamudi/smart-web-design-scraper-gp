import { Request, Response, NextFunction } from 'express';
import { db } from '../models';

const { ROLES } = db;
const User = db.user;

const checkDuplicateUsernameOrEmail = (req: Request, res: Response, next: NextFunction) => {
    // Username
    User.findOne({
        username: req.body.username,
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: 'Failed! Username is already in use!' });
            return;
        }

        // Email
        User.findOne({
            email: req.body.email,
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (user) {
                res.status(400).send({ message: 'Failed! Email is already in use!' });
                return;
            }

            next();
        });
    });
};

const checkRolesExisted = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i += 1) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`,
                });
            }
        }
    }

    next();
};

export const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted,
};
