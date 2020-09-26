import mongoose from "mongoose";
import { User } from "./user.model";
import { Role } from "./role.model";

mongoose.Promise = global.Promise;

export const db = {
    mongoose: mongoose,
    user: User,
    role: Role,
    ROLES: ['user', 'admin']
};
