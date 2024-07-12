import { Router } from 'express';
import { TaskTypeModel, TaskStatusModel } from '../models/option.model';

const taskTypeStatusRouter = Router();

taskTypeStatusRouter.get("/task-types", async (request, response) => {
    const taskTypes = await TaskTypeModel.find();
    response.send(taskTypes);
});

taskTypeStatusRouter.get("/task-statuses", async (request, response) => {
    const taskStatuses = await TaskStatusModel.find();
    response.send(taskStatuses);
});

export default taskTypeStatusRouter;