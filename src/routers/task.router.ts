import { json, Router } from 'express';
import { initialTasks, initialTaskTypes, initialTaskStatuses, initialUsers } from "../initialTaskData";
import { Task, TaskModel, toBasicTask } from '../models/task.model';
import { TaskTypeModel, TaskStatusModel, Option } from '../models/option.model';
import { UserModel } from '../models/user.model';

const taskRouter = Router();

taskRouter.use(json());

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

    // Initialize users
    if(!await UserModel.countDocuments()) await UserModel.create(initialUsers);
    let users = await UserModel.find();

    response.send("Database is intialized")
});

taskRouter.get("/essential-task-data", async (request, response) => {

    const taskStatuses = await TaskStatusModel.find();  
    const taskTypes = await TaskTypeModel.find();  
    const tasks = await TaskModel.find();    
    response.send({
        'taskStatuses' : taskStatuses,
        'taskTypes' : taskTypes,
        'tasks' : tasks.map(task => toBasicTask(task))
    });

});

taskRouter.get("/tasks", async (request, response) => {

    const tasks = await TaskModel.find();    
    response.send(tasks.map(task => toBasicTask(task)));

});

taskRouter.get("/tasks/:taskId", async (request, response) => {
    const task = await TaskModel.findOne({ _id: request.params.taskId });
    response.send(task);
});

taskRouter.post("/tasks", async (request, response) => {
    // Validate that new task title is unique
    const taskTitles = (await TaskModel.find()).map(task => task.title);
    const requestBodyTaskTitle = request.body.title;
    if (taskTitles.includes(requestBodyTaskTitle)) {
        response.status(400).send({error: "Task title must be unique"});
        return;
    }
    const task = await TaskModel.create(request.body);
    response.send(task);
});

taskRouter.delete("/tasks/:taskId", async (request, response) => {
    await TaskModel.deleteOne({ _id: request.params.taskId });
    const newTasks = await TaskModel.find();
    response.send(newTasks);
});

taskRouter.patch("/tasks/:taskId", async (request, response) => {
    
    const requestTaskId = request.params.taskId;

    // Validate that new task title is unique
    const taskTitles = (await TaskModel.find())
        .filter(task => task.id == requestTaskId)
        .map(task => task.title);
    const requestBodyTaskTitle = request.body.title;
    if (taskTitles.includes(requestBodyTaskTitle)) {
        response.status(400).send({error: "Task title must be unique"});
        return;
    }

    // Update by id
    await TaskModel.updateOne(
        { _id: requestTaskId },
        { $set: request.body }
    );

    // Fetch updated task
    const task = await TaskModel.findOne({ _id: requestTaskId });
    response.send(task);
});

taskRouter.patch("/tasks/:taskId", async (request, response) => {
    // Validate that new task title is unique except for task in request
    const taskTitles = await TaskModel.find({$nor: [ {_id: request.params.taskId}]});
    if (taskTitles.map(task => task.title).includes(request.body.title)) {
        response.status(400).send({error: "Task title must be unique"});
        return;
    }
    const task = await TaskModel.findOneAndUpdate(
        { _id: request.params.taskId },
        { $set: request.body },
        { new: true }
    );
    response.send(task);
});

export default taskRouter;