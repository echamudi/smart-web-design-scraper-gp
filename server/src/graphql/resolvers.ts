import { IResolverObject, IResolvers, IFieldResolver } from 'apollo-server';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import config from '../configs/auth.config';
import bcrypt from 'bcryptjs';
import { context, ContextInterface } from './context';

import { db } from '../models';

const User = db.user;
const Role = db.role;
const History = db.history;

export const resolvers: IResolvers = {
    Query: {
        login: async (parent, args: {username: string, password: string}, context: ContextInterface, info) => {
            const user = await User.findOne({
                username: args.username,
            }).populate('roles', '-__v');
        
            if (!user) {
                return new Error('user or password is not valid');
            }
        
            const passwordIsValid = bcrypt.compareSync(
                args.password,
                user.password,
            );
        
            if (!passwordIsValid) {
                return new Error('user or password is not valid');
            }
        
            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400, // 24 hours
            });
        
            const authorities = [];
        
            for (let i = 0; i < user.roles.length; i += 1) {
                authorities.push(`ROLE_${user.roles[i].name.toUpperCase()}`);
            }
        
            return {
                success: true,
                user: {
                    username: user.username,
                    email: user.email,
                    roles: user.roles.map(el => el.name),
                },
                token: token
            };
        },
        getCurrentUser: async (parent, args, context: ContextInterface, info) => {
            if (context.user) {
                return {};
            } else {
                return null;
            }
        }
    },
    Mutation: {
        signup: async (parent, args: {username: string, password: string, email: string}, context: ContextInterface, info) => {
            // Check arguments

            const username = args.username?.trim() ?? '';
            const password = args.password?.trim() ?? '';
            const email = args.email?.trim() ?? '';

            if (username === '') {
                return new Error('username can\'t be empty');
            }

            if (password === '') {
                return new Error('password can\'t be empty');
            }

            if (email === '') {
                return new Error('email can\'t be empty');
            }

            if (await User.findOne({ username })) {
                return new Error('username already exists');
            }

            if (await User.findOne({ email })) {
                return new Error('email already exists');
            }

            // Get user role id

            const userRole = await Role.findOne({ name: 'user' });

            let roles: string[];
            if (userRole) {
                roles = [ userRole._id ];
            } else {
                return new Error('can\'t find "user" role');
            }

            // Save user

            const user = new User({
                username: args.username,
                email: args.email,
                password: bcrypt.hashSync(args.password, 8),
                roles
            });

            const savedUser = await user.save();

            if (!savedUser) {
                return new Error('Something is wrong while saving user');
            }
            console.log(savedUser);

            return {
                success: true,
                username,
                email
            }
        },
        saveAnalysis: async (parent, args: {data: string}, context: ContextInterface, info) => {
            const uid = context.user?.id;

            if (typeof uid !== 'string') {
                return new Error('user is not logged in');
            }

            const analysis = new History({
                owner: uid,
                data: 'Tralala'
            });

            const savedAnalysis = await analysis.save();

            if (!savedAnalysis) {
                return new Error('Something is wrong while saving analysis');
            }

            console.log(context);
            return true;
        },
    },
    User: {
        username: async (parent, args, context: ContextInterface, info) => {
            if (parent?.username) return parent.username
            return context.user?.username;
        },
        email: async (parent, args, context: ContextInterface, info) => {
            if (parent?.email) return parent.email;
            return context.user?.email;
        },
        roles: async (parent, args, context: ContextInterface, info) => {
            if (parent?.roles) return parent.roles;
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
