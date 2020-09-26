import { db } from '../models';
import { Request, Response, NextFunction } from 'express';

const User = db.user;
const Role = db.role;

const isAdmin = (req: Request & {userId: string}, res: Response, next: NextFunction) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!user) {
            res.status(500).send({ message: 'User not found' });
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

export const authJwt = {
    isAdmin,
};