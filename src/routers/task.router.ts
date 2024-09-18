import { json, Router } from 'express';
import { authenticatedUser } from '../guards/auth.guard';
import { TaskService } from '../services/task.service';

const taskRouter = Router();
const taskService = new TaskService();

taskRouter.use(json());
taskRouter.use(authenticatedUser);

taskRouter.get("/initialize", async (request, response) => {

    return TaskService.initializeTasks();
});

taskRouter.get("/essential-task-data", async (request, response) => {
 
    response.send(await taskService.getEssentialTaskData());

});

taskRouter.get("/", async (request, response) => {
 
    response.send(await taskService.getTasks());

});

taskRouter.get("/:taskId", async (request, response) => {
    
    response.send(await taskService.getTaskById(request.params.taskId));

});

taskRouter.post("/", async (request, response) => {

    try {
        response.send(await taskService.createTask(request.body));
    }
    catch (error: any) {
        response.status(400).send({error: error.message});
    }

});

taskRouter.delete("/:taskId", async (request, response) => {

    response.send(await taskService.deleteTask(request.params.taskId));

});

taskRouter.patch("/:taskId", async (request, response) => {
    
    try {
        response.send(await taskService.updateTask(request.params.taskId, request.body));
    }
    catch (error: any) {
        response.status(400).send({error: error.message});
    }

});

export default taskRouter;