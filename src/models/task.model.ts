import {Schema, model} from 'mongoose';

export interface Task {
    title: string, 
    description: string, 
    type: {
        value: string,
        displayName: string
    },
    status: {
        value: string,
        displayName: string
    }
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
        }
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

export function toBasicTask(task : any) {
    return {
        id: task.id,
        title: task.title, 
        type: {
            value: task.type.value,
            displayName: task.type.displayName
        }
    }
}