import { Router } from 'express';
import { initialTasks, initialTaskTypes, initialTaskStatuses } from "../initialTaskData";
import { Task, TaskModel } from '../models/task.model';
import { TaskTypeModel, TaskStatusModel, Option } from '../models/option.model';

const taskRouter = Router();

taskRouter.get("/tasks/initialize", async (request, response) => {

    // Initialize task types
    if(!await TaskTypeModel.countDocuments()) await TaskTypeModel.create(initialTaskTypes);
    let taskTypes = await TaskTypeModel.find();

    // Initialize task statuses
    if(!await TaskStatusModel.countDocuments()) await TaskStatusModel.create(initialTaskStatuses);
    let taskStatuses = await TaskStatusModel.find();

    if(!await TaskModel.countDocuments()) {

        let tasks : Task[] = [];
        let taskType : Option | undefined;
        let taskStatus : Option | undefined;
        initialTasks.forEach(initialTask => {
            taskType = taskTypes.find( taskType => 
                taskType.value == initialTask.type
            );
            taskStatus = taskStatuses.find( taskStatus => 
                taskStatus.value == initialTask.status
            );
            if(!taskType || !taskStatus) throw Error("");

            tasks.push({
                id: 0,
                title: initialTask.title,
                description: initialTask.description,
                type: taskType,
                status: taskStatus,
                createdOn: new Date(initialTask.createdOn),
                modifiedOn: new Date(initialTask.modifiedOn)
            });
        });
        await TaskModel.create(tasks);
    };        

    response.send("Database is intialized")
});

taskRouter.get("/tasks", async (request, response) => {
    const tasks = await TaskModel.find();
    response.send(tasks);
});

export default taskRouter;