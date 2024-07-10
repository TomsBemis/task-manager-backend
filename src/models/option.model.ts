import {Schema, model} from 'mongoose';

export type Option = {
    value: string,
    displayName: string
}

export const OptionSchema = new Schema<Option>(
    {
        value: {type: String, required: true},
        displayName: {type: String, required: true}
    }
);

export const TaskTypeModel = model<Option>('task-types', OptionSchema);
export const TaskStatusModel = model<Option>('task-statuses', OptionSchema);