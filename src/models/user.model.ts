import {Schema, model} from 'mongoose';

export interface User {
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    token: string,
    tokenExpirationDate: Date
}

export const UserSchema = new Schema<User>(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        token: {type: String},
        tokenExpirationDate: {type: Date},
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