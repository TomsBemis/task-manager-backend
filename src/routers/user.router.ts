import { json, Router } from 'express';
import { UserService } from '../services/user.service';
import { AuthenticatedUser, UserData } from '../models/user.model';
import { authenticatedUser } from '../guards/auth.guard';
import { userRoleGuard } from '../guards/user-role.guard';
import { initialRoles } from '../initialUserData';

const userRouter = Router();
const userService = new UserService();

userRouter.use(json());
userRouter.use(authenticatedUser);

userRouter.get(["/"], userRoleGuard([initialRoles['ADMIN']], true));
userRouter.post(["/:userId"], userRoleGuard([initialRoles['ADMIN']], true));

userRouter.get("/", async (request, response) => {
    try {

        response.json({
            users: await userService.getUsers()
        });
    }
    catch (error) {
        console.log(error);
        response.status(500);
        response.send(error);
    }
});

userRouter.get("/:userId", async (request, response) => {
    
    const authenticatedUser: AuthenticatedUser = request.body['authenticatedUser'];
    if(!authenticatedUser.user.roles.includes("ADMIN")) {
        if(request.params.userId !== authenticatedUser.userId) {
            response.status(401);
            response.json({ error: "Only users with administrator priviledges or users owners have access." });
            return;
        }
    }

    if(!authenticatedUser) {
        response.status(401);
        response.json({ error: "Internal Server Error" });
        return;
    }
    try {

        let userById: UserData | null = await userService.getUserById(request.params.userId);

        if(!userById) {
            response.status(404);
            response.send();
        }

        response.send({
            user: userById
        });
    }
    catch (error) {
        console.log(error);
        response.status(500);
        response.send(error);
    }
});

userRouter.post("/:userId", async (request, response) => {
    try {

        const authenticatedUser: AuthenticatedUser = request.body['authenticatedUser'];
        if(!authenticatedUser.user.roles.includes("ADMIN")) {
            response.status(401);
            response.json({ error: "Only users with administrator priviledges have access." });
            return;
        }

        let updatedUser: UserData | null = await userService.updateRoles(request.params.userId, request.body.roles);

        if(!updatedUser) {
            response.status(404);
            response.send();
        }

        response.json({
            user: updatedUser
        });
    }
    catch (error: any) {
        console.log(error);
        response.json({
            error: error.message
        });
    }
});

export default userRouter;