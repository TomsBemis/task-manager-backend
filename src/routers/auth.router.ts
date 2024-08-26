import { json, Router } from 'express';
import { AuthCredentials, User, UserModel } from '../models/user.model';
import { AuthService } from '../auth.service';
import { InternalError } from '../server';
import { initialRoles, initialUsers } from '../initialUserData';
import { RoleModel } from '../models/option.model';

const authRouter = Router();
const authService = new AuthService();
const bcrypt = require('bcrypt');

authRouter.use(json());

authRouter.get("/initialize", async (request, response) => {

    // Initialize roles
    if(!await RoleModel.countDocuments()) await RoleModel.create(initialRoles);
    let roles = await RoleModel.find();

    // Initialize users
    if(!await UserModel.countDocuments()) {

        let userData : User[] = [];

        if(process.env.SALT_ROUNDS) {

            // Generate salt
            bcrypt.genSalt(+process.env.SALT_ROUNDS, async (error: Error, salt: string) => {

                if (error) throw new Error("Error while generating salt: "+error.message);
                
                initialUsers.forEach(async initialUser => {
                    
                    // Hash password
                    await bcrypt.hash(initialUser.password, salt, async (error: Error, hash: string) => {

                        if (error) throw new Error("Error while hashing password: "+error.message);
        
                        await UserModel.collection.insertOne({
                            username: initialUser.username,
                            password: hash,
                            firstName: initialUser.firstName,
                            lastName: initialUser.lastName,
                            accessToken: null,
                            refreshToken: null,
                            role: initialUser.role,
                        });
                    });
                });
            });
        }
        else throw new Error("Authentication settings not configured");

    } 

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