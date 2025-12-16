import { ObjectId } from "mongodb";
import { initialRoles, initialUsers } from "../assets/initialUserData";
import { UserData, UserModel } from "../models/user.model";
import { Role, RoleModel } from "../models/role.model";

const bcrypt = require('bcrypt');

export class UserService {

    static async initializeUsers(): Promise<void> {
            
        // Delete all roles from DB and initialize roles
        await RoleModel.deleteMany({}).then(async result => {
            let roles: Role[] = [];
            for (let key in initialRoles) roles.push(initialRoles[key])
            await RoleModel.create(roles);
            roles = await RoleModel.find();

        });

        // Delete all users from DB and initialize users
        await UserModel.deleteMany({}).then(async () => {

            if(process.env.SALT_ROUNDS) {

                // Generate salt
                bcrypt.genSalt(+process.env.SALT_ROUNDS, async (error: Error, salt: string) => {

                    if (error) throw new Error("Error while generating salt: "+error.message);
                    
                    initialUsers.forEach(async initialUser => {
                        
                        // Hash password
                        await bcrypt.hash(initialUser.password, salt, async (error: Error, hash: string) => {

                            if (error) throw new Error("Error while hashing password: "+error.message);
            
                            await UserModel.collection.insertOne({
                                _id: new ObjectId(initialUser._id),
                                username: initialUser.username,
                                password: hash,
                                firstName: initialUser.firstName,
                                lastName: initialUser.lastName,
                                accessToken: null,
                                refreshToken: null,
                                roles: initialUser.roles,
                            });
                        });
                    });
                });
            }
            else throw new Error("Authentication settings not configured");
        })
    }

    public async getUsers(): Promise<UserData[] | null> {
        return (await UserModel.find()).map(user => {
            return UserService.convertToUserData(user);
        });
    }

    public async getUserById(userId: string): Promise<UserData | null> {
        const user: any = await UserModel.findOne({ _id: userId });

        if(!user) return null;
        return UserService.convertToUserData(user);
    }

    public async updateRoles(userId: string, updatedRoles: Role[]): Promise<UserData | null> {

        // Check if user exists by id
        const userById: any = await UserModel.findOne({ _id: userId });
        if(!userById) return null;

        // Validate that new roles can be assigned
        let managerRole: Role[] = updatedRoles.filter(updatedRole => {
            return updatedRole.name === "MANAGER";
        });

        if(managerRole == null) throw Error("Only manager role can be updated");

        await UserModel.updateOne(
            { _id: userId },
            { $set: {roles: updatedRoles} }
        )

        return UserService.convertToUserData(await UserModel.findOne({ _id: userId }));
    }

    // Method for converting full user object into a object with only the basic information
    public static convertToUserData(user: any) : UserData {   // Setting parameter type to User doesn't allow fetching hidden field '_id'
    
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles
        };
    }
}