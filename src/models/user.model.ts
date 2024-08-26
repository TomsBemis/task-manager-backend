import {Schema, model} from 'mongoose';

// Role model

export interface Role {
    value: string,
    displayName: string
}

export const RoleSchema = new Schema<Role>(
    {
        value: {type: String, required: true},
        displayName: {type: String, required: true}
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
)

export const RoleModel = model<Role>('roles', RoleSchema);

// User model

export interface User {
    _id: string,
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
        _id: {type: String, required: true},
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
}

export interface LoginResponse {
    authentication: AuthCredentials
    user: User,
}

export interface AuthCredentials {
    accessToken: string,
    refreshToken: string,
    userId: string,
}