import { json, Router } from 'express';
import { AuthCredentials } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { InternalError } from '../server';
import { authenticatedUser } from '../guards/auth.guard';

const authRouter = Router();
const authService = new AuthService();

authRouter.use(json());
authRouter.use("/logout", authenticatedUser);

authRouter.post("/login", async (request, response) => {

    try {
        const user : any = await authService.isUserValid(request);
        if (user) {
            
            const authCredentials : AuthCredentials = await authService.authenticateUser(user?.id);

            response.status(200);
            response.send({
                authentication: authCredentials,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                }
            });
        }
    }
    catch (error) {
        console.log(error);
        if(error instanceof InternalError) {
            response.status(500);
            response.send(error.message);
        }
        else if(error instanceof Error) {
            response.status(400);
            response.send(error.message);
        }
    }
});

authRouter.post("/logout", async (request, response) => {
    try {
        const user : any = await authService.isUserValid(request);
        if (user) {
            response.status(200);
            response.send(await authService.removeUserToken(user?._id));
        }
    }
    catch (error) {
        if(error instanceof InternalError) {
            response.status(500);
            response.send(error.message);
        }
        else if(error instanceof Error) {
            response.status(400);
            response.send(error.message);
        }
    }
})

export default authRouter;