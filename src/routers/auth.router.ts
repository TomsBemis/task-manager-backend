import { json, Router } from 'express';
import { AuthCredentials, AuthenticatedUser } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { InternalError } from '../server';
import { authenticatedUser } from '../guards/auth.guard';

const authRouter = Router();
const authService = new AuthService();

authRouter.use(json());
authRouter.use("/logout", authenticatedUser);

authRouter.post("/login", async (request, response) => {

    try {
        const user : any = await authService.isUserValid(
            request.body.username,
            request.body.password
        );
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

authRouter.get("/logout", async (request, response) => {

    const authenticatedUser: AuthenticatedUser = request.body['authenticatedUser'];
    if(!authenticatedUser) {
        response.status(500);
        response.json({ error: "Internal Server Error" });
        return;
    }
        
    try {
        await authService.removeUserToken(authenticatedUser.userId)
        response.send();
    }
    catch (error: any) {
        response.status(500);
        response.json(error.message);
    }
})

export default authRouter;