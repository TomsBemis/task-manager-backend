import {Schema, model} from 'mongoose';

export interface Task {
    id: number,
    title: string, 
    description: string, 
    type: {
        value: string,
        displayName: string
    },
    status: {
        value: string,
        displayName: string
    },
    createdOn: Date, 
    modifiedOn: Date
}

export const TaskSchema = new Schema<Task>(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        type: {
            value: {type: String, required: true},
            displayName: {type: String, required: true}
        },
        status: {
            value: {type: String, required: true},
            displayName: {type: String, required: true}
        },
        createdOn: {type: Date, required: true},
        modifiedOn: {type: Date, required: true},
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

export const TaskModel = model<Task>('tasks', TaskSchema);