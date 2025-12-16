import {Schema, model} from 'mongoose';

export type Role = {
    name: string, 
}

export const RoleSchema = new Schema<Role>(
    {
        name: {type: String, required: true},
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

export const RoleModel = model<Role>('roles', RoleSchema);