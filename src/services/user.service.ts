import { ObjectId } from "mongodb";
import { initialRoles, initialUsers } from "../initialUserData";
import { Option, RoleModel } from "../models/option.model";
import { UserData, UserModel, UserRole } from "../models/user.model";

const bcrypt = require('bcrypt');

export class UserService {

    static async initializeUsers(): Promise<void> {
            
        // Delete all roles from DB and initialize roles
        await RoleModel.deleteMany({}).then(async result => {
            let roleValues: Option[] = [];
            for (let key in initialRoles) roleValues.push(initialRoles[key])
            await RoleModel.create(roleValues);
            roleValues = await RoleModel.find();
        })

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

    public async updateRoles(userId: string, updatedRoles: UserRole[]): Promise<UserData | null> {

        // Check if user exists by id
        const userById: any = await UserModel.findOne({ _id: userId });
        if(!userById) return null;

        // Validate that new roles can be assigned
        let managerRole: UserRole[] = updatedRoles.filter(updatedRole => {
            return updatedRole.role.value === "MANAGER";
        });

        if(managerRole == null) throw Error("Only manager role can be updated");

        await UserModel.updateOne(
            { _id: userId },
            { $set: {roles: managerRole[0].enabled ? "MANAGER" : "USER"} }
        )

        return UserService.convertToUserData(await UserModel.findOne({ _id: userId }));
    }

    /* Method to be used to hide user password and retrieve full role data */
    public static convertToUserData(user: any){   // Setting parameter type to User doesn't allow fetching hidden field '_id'
    
        let foundRoles: Option[] = [];
        user.roles.forEach((role: string) => {
            foundRoles.push(initialRoles[role]);
        })
        if(!foundRoles) throw Error("Role value "+user.role+" not found!");
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: foundRoles
        };
    }
}