import { json, Router } from 'express';
import { authenticatedUser } from '../guards/auth.guard';
import { TaskService } from '../services/task.service';
import { userRoleGuard } from '../guards/user-role.guard';
import { initialRoles } from '../initialUserData';

const taskRouter = Router();
const taskService = new TaskService();

taskRouter.use(json());
taskRouter.use(authenticatedUser);

// User allowed routes
taskRouter.get(
    ["/", "/essential-task-data", "/:taskId"], 
    userRoleGuard([initialRoles['USER']], true)
);

taskRouter.get("/essential-task-data", async (request, response) => {
 
    response.send(await taskService.getEssentialTaskData());

});

taskRouter.get("/", async (request, response) => {
 
    response.send(await taskService.getTasks());

});

taskRouter.get("/:taskId", async (request, response) => {
    
    response.send(await taskService.getTaskById(request.params.taskId));

});

// Admin allowed routes

taskRouter.get("/initialize", async (request, response) => {
    return await TaskService.initializeTasks();
}).use(userRoleGuard([initialRoles['ADMIN']], true));

taskRouter.post("/", async (request, response) => {

    try {
        response.send(await taskService.createTask(request.body));
    }
    catch (error: any) {
        response.status(400).send({error: error.message});
    }

}).use(userRoleGuard([initialRoles['ADMIN']], true));

taskRouter.delete("/:taskId", async (request, response) => {

    response.send(await taskService.deleteTask(request.params.taskId));

}).use(userRoleGuard([initialRoles['ADMIN']], true));

taskRouter.patch("/:taskId", async (request, response) => {
    
    try {
        response.send(await taskService.updateTask(request.params.taskId, request.body));
    }
    catch (error: any) {
        response.status(400).send({error: error.message});
    }

}).use(userRoleGuard([initialRoles['ADMIN']], true));

export default taskRouter;