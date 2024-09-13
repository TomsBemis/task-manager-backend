import {Schema, model} from 'mongoose';
import { Option } from './option.model';

// User model

export interface User {
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    accessToken: string | null,
    refreshToken: string | null,
    role: string
}

export const UserSchema = new Schema<User>(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        accessToken: {type: String},
        refreshToken: {type: String},
        role: {type: String, required: true},
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

// Other interfaces

export interface UserData {
    id: string,
    firstName: string,
    lastName: string,
    role: Option
}

export interface AuthCredentials {
    accessToken: string,
    refreshToken: string,
    userId: string,
}

export interface AuthenticatedUser {
    userId: string,
    user: User
}

export interface UserRole {
    role: Option, 
    enabled: boolean
}