import {Schema, model} from 'mongoose';

export interface User {
    username: string, 
    password: string
}

export const UserSchema = new Schema<User>(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
    },
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

export const UserModel = model<User>('users', UserSchema);