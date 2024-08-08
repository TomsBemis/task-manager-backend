import { json, Router } from 'express';
import { UserModel } from '../models/user.model';
import { AuthService } from '../auth.service';

const authRouter = Router();
const authService = new AuthService();

authRouter.use(json());

authRouter.post("/login", async (request, response) => {
    const users = await UserModel.find();
    users.every(async user => {
        if ( user.username === request.body.username ) {
            if ( user.password === request.body.password ) {
                
                try {
                    response.status(200);
                    response.send(await authService.authenticateUser(user.id));
                } catch (error) {
                    console.log(error);
                    response.status(500);
                    response.send({"message" : "Internal server error"});
                }
                return;
            }
            else {
                response.status(400);
                response.send({"message" : "Invalid password"});
            }
        }
        else {
            response.status(400);
            response.send({"message" : "Invalid username"});
        }
    })
});

export default authRouter;