import { Router } from 'express';
import { initialTasks, initialTaskTypes, initialTaskStatuses } from "../initialTaskData";
import { Task, TaskModel, toBasicTask } from '../models/task.model';
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
        
        initialTasks.forEach(initialTask => {
            tasks.push({
                title: initialTask.title,
                description: initialTask.description,
                type: taskTypes.find( taskType => 
                    taskType.value == initialTask.type
                ) as Option,
                status: taskStatuses.find( taskStatus => 
                    taskStatus.value == initialTask.status
                ) as Option,
            });
        });
        await TaskModel.create(tasks);
    };        

    response.send("Database is intialized")
});

taskRouter.get("/tasks", async (request, response) => {

    const tasks = await TaskModel.find();    
    response.send(tasks.map(task => toBasicTask(task)));

});

taskRouter.get("/tasks/:taskId", async (request, response) => {
    const task = await TaskModel.findOne({ _id: request.params.taskId });
    response.send(task);
});

export default taskRouter;