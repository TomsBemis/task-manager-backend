import { json, Router } from 'express';
import { AuthCredentials, AuthenticatedUser, User, UserData } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { InternalError } from '../server';
import { authenticatedUser } from '../guards/auth.guard';

const authRouter = Router();
const authService = new AuthService();

authRouter.use(json());
authRouter.use("/logout", authenticatedUser);

authRouter.post("/login", async (request, response) => {

    try {
        const userData : UserData | null = await authService.getUserByCredentials(
            request.body.username,
            request.body.password
        );
        if (userData) {
            
            const authCredentials : AuthCredentials = await authService.authenticateUser(userData?.id);

            response.status(200);
            response.send({
                authentication: authCredentials,
                user: userData
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

authRouter.post("/register", async (request, response) => {

    try {

        let userData : UserData;
        try {
            userData = await authService.getUserByCredentials(
                request.body.username,
                null
            );
            // User was found
            if(await authService.getUserByCredentials(request.body.username, null)) {
                response.status(400);
                response.send("Username already exists");
            }
        }
        catch (error) { // User not found by username, new user can be registered
            if(error instanceof InternalError) throw error;

            response.status(200);
            response.send(await authService.registerUser(request.body));
        }
    }
    catch (error) {
        console.log(error);
        if(error instanceof InternalError) 
        {
            response.status(500);
            response.send({error: error.message});
        }
        else if(error instanceof Error) {
            response.status(400);
            response.send({error: error.message});
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