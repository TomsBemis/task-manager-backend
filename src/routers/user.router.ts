import { json, Router } from 'express';
import { UserService } from '../services/user.service';
import { AuthenticatedUser, User, UserData } from '../models/user.model';
import { authenticatedUser } from '../guards/auth.guard';
import { userRoleGuard } from '../guards/user-role.guard';
import { initialRoles } from '../initialUserData';

const userRouter = Router();
const userService = new UserService();

userRouter.use(json());
userRouter.use("initialize", authenticatedUser, userRoleGuard([initialRoles['admin']], true));
userRouter.use("/", authenticatedUser, userRoleGuard([initialRoles['admin']], true));
userRouter.use("/:userId", authenticatedUser);

userRouter.get("/initialize", async (request, response) => {

    try {
        UserService.initializeUsers();
        response.send("Database is intialized");
    }
    catch (error) {
        console.log(error);
        response.status(500);
        response.send(error);
    }
});

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

    if(authenticatedUser.user.role !== "ADMIN") {
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