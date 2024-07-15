import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { TaskModel } from '../models/task.model';

const router = Router();

router.get("/", asyncHandler(async (request, response) => {
    const tasks = await TaskModel.find();
    response.send(tasks);
}));

export default router;