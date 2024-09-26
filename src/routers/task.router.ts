import { json, Router } from 'express';
import { authenticatedUser } from '../guards/auth.guard';
import { TaskService } from '../services/task.service';
import { userRoleGuard } from '../guards/user-role.guard';
import { initialRoles } from '../initialUserData';
import { AuthenticatedUser, UserData, UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';

const taskRouter = Router();
const taskService = new TaskService();

taskRouter.use(json());
taskRouter.use(authenticatedUser);

taskRouter.get(["/", "/essential-task-data", "/:taskId"], userRoleGuard([initialRoles['USER']], true));
taskRouter.get(["/initialize"], userRoleGuard([initialRoles['ADMIN']], true));
taskRouter.post(["/"], userRoleGuard([initialRoles['ADMIN']], true));
taskRouter.delete(["/:taskId"], userRoleGuard([initialRoles['ADMIN']], true));
taskRouter.patch(["/:taskId"], userRoleGuard([initialRoles['ADMIN'], initialRoles['MANAGER']], true));

taskRouter.get("/essential-task-data", async (request, response) => {
 
    response.send(await taskService.getEssentialTaskData());

});

taskRouter.get("/", async (request, response) => {
 
    response.send(await taskService.getTasks());

});

taskRouter.get("/:taskId", async (request, response) => {

    const taskById = await taskService.getTaskById(request.params.taskId);
    
    // If authenticated user is a manager, add assignable users to response
    const authenticatedUser: AuthenticatedUser = request.body['authenticatedUser'];
    if(authenticatedUser.user.roles.includes("MANAGER")) {
        const assignableUsers: UserData[] = [];
        (await UserModel.find({ roles: { $elemMatch: {$in: "USER"} }})).forEach(user => {
            assignableUsers.push(UserService.convertToUserData(user))
        });

        response.send({
            task: taskById,
            assignableUsers: assignableUsers
        });
        return;
    }
    response.send({
        task: taskById
    });

});

taskRouter.get("/initialize", async (request, response) => {
    return await TaskService.initializeTasks();
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
        const authenticatedUser: AuthenticatedUser = request.body['authenticatedUser'];
        const taskData = await taskService.validateTaskData(authenticatedUser.user, request.params.taskId, request.body);
        response.send(await taskService.updateTask(request.params.taskId, taskData));
    }
    catch (error: any) {
        response.status(400).send({error: error.message});
    }
});

export default taskRouter;