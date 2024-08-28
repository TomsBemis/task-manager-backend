import { json, Router } from 'express';
import { UserService } from '../user.service';
import { UserData } from '../models/user.model';
import { authenticatedUser } from '../guards/auth.guard';

const userRouter = Router();
const userService = new UserService();

userRouter.use(json());
userRouter.use("/", authenticatedUser);
userRouter.use("/:userId", authenticatedUser);

userRouter.get("/initialize", async (request, response) => {

    try {
        userService.initializeUsers();
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
        response.send({
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

export default userRouter;