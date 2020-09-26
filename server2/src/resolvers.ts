import { IResolverObject, IResolvers, IFieldResolver } from 'apollo-server';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import config from './configs/auth.config';
import bcrypt from 'bcryptjs';
import { context, ContextInterface } from './context';

import { db } from './models';

const User = db.user;
const Role = db.role;

export const resolvers: IResolvers = {
    Query: {
        login: async (parent, args: {username: string, password: string}, context: ContextInterface, info) => {
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
        },
        getCurrentUser: async (parent, args: ContextInterface, context, info) => {
            if (context.user) {
                return {};
            } else {
                return null;
            }
        }
    },
    Mutation: {
        // TODO: add signup resolver
    },
    User: {
        username: async (parent, args, context: ContextInterface, info) => {
            return context.user?.username;
        },
        email: async (parent, args, context: ContextInterface, info) => {
            return context.user?.email;
        },
        roles: async (parent, args, context: ContextInterface, info) => {
            return context.user?.roles?.map(role => role.name);
        },
        isUser: async (parent, args, context: ContextInterface, info) => {
            return context.isUser;
        },
        isAdmin: async (parent, args, context: ContextInterface, info) => {
            return context.isAdmin;
        },
    }
};
