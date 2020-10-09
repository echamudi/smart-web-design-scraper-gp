import mongoose, { Schema, Document } from "mongoose";

export interface HistoryInterface extends Document {
    owner: string,
    data: string,
    createdAt?: Date,
    updatedAt?: Date
}

export const History = mongoose.model<HistoryInterface>(
    'History',
    new mongoose.Schema({
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            unique: false,
            required: true,
        },
        data: {
            type: String,
            unique: false,
            required: true,
        },
    }, {
        timestamps: true
    }),
);
