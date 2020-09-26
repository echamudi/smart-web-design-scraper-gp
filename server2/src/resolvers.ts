import { IResolverObject, IResolvers, IFieldResolver } from 'apollo-server';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import config from './configs/auth.config';
import bcrypt from 'bcryptjs';

import { db } from './models';

const User = db.user;
const Role = db.role;

const login: IFieldResolver<any, any> = async (parent, args, context, info) => {
    const user = await User.findOne({
        username: args.username,
    }).populate('roles', '-__v');

    if (!user) {
        return {
            message: 'User not found!'
        };
    }

    const passwordIsValid = bcrypt.compareSync(
        args.password,
        user.password,
    );

    if (!passwordIsValid) {
        return {
            message: 'Invalid Password!'
        };
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
    });

    const authorities = [];

    for (let i = 0; i < user.roles.length; i += 1) {
        authorities.push(`ROLE_${user.roles[i].name.toUpperCase()}`);
    }

    return {
        user: {
            username: user.username,
            email: user.email,
            roles: user.roles.map(el => el.name),
        },
        token: token
    };
};

export const resolvers: IResolvers = {
    Query: {
        login,
        // TODO: add getUser
    },
    Mutation: {
        // TODO: add signup resolver
    }
};
