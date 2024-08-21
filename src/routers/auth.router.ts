import { json, Router } from 'express';
import { AuthResponse, User } from '../models/user.model';
import { AuthService } from '../auth.service';
import { InternalError } from '../server';

const authRouter = Router();
const authService = new AuthService();
const jwt = require('jsonwebtoken');

authRouter.use(json());

authRouter.post("/login", async (request, response) => {

    try {
        const user : User | null = await authService.isUserValid(request);
        if (user) {
            response.status(200);
            response.send(await authService.authenticateUser(user?.id));
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
});

authRouter.post("/logout", async (request, response) => {
    try {
        const user : User | null = await authService.isUserValid(request);
        if (user) {
            response.status(200);
            response.send(await authService.removeUserToken(user?.id));
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