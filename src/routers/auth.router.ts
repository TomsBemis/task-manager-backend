import { json, Router } from 'express';
import { AuthCredentials, Role, RoleModel, User, UserModel } from '../models/user.model';
import { AuthService } from '../auth.service';
import { InternalError } from '../server';
import { initialRoles, initialUsers } from '../initialUserData';

const authRouter = Router();
const authService = new AuthService();

authRouter.use(json());

authRouter.get("/initialize", async (request, response) => {

    // Initialize roles
    if(!await RoleModel.countDocuments()) await RoleModel.create(initialRoles);
    let roles = await RoleModel.find();

    // Initialize users
    if(!await UserModel.countDocuments()) {

        let users : User[] = [];
        
        initialUsers.forEach(initialUser => {

            users.push({
                _id: initialUser._id,
                username: initialUser.username,
                password: initialUser.password,
                firstName: initialUser.firstName,
                lastName: initialUser.lastName,
                accessToken: null,
                refreshToken: null,
                role: initialUser.role,
            });
        });
    }

    if(!await UserModel.countDocuments()) await UserModel.create(initialUsers);

    response.send("Database is intialized");
});

authRouter.post("/login", async (request, response) => {

    try {
        const user : User | null = await authService.isUserValid(request);
        if (user) {
            
            const authCredentials : AuthCredentials = await authService.authenticateUser(user?._id);

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
        const user : User | null = await authService.isUserValid(request);
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