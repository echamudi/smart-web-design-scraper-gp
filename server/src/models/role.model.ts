import mongoose, { Schema, Document } from "mongoose";

export interface RoleInterface extends Document {
    name: string
}

export const Role = mongoose.model<RoleInterface>(
    'Role',
    new mongoose.Schema({
        name: String,
    }),
);
