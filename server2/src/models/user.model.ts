import mongoose, { Schema, Document } from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import { RoleInterface } from './role.model';

export interface UserInterface extends Document {
    username: string;
    email: string;
    password: string;
    roles: RoleInterface[]
}

const UserSchema: Schema = new mongoose.Schema({
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

export const User = mongoose.model<UserInterface>('User', UserSchema);
