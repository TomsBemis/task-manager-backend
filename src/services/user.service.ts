import { initialRoles, initialUsers } from "../initialUserData";
import { Option, RoleModel } from "../models/option.model";
import { User, UserData, UserModel } from "../models/user.model";

const bcrypt = require('bcrypt');

export class UserService {

    private roles : Option[] = [];

    static async initializeUsers(): Promise<void> {
            
        // Delete all roles from DB and initialize roles
        await RoleModel.deleteMany({}).then(async result => {
            let roleValues: Option[] = [];
            for (let key in initialRoles) roleValues.push(initialRoles[key])
            await RoleModel.create(roleValues);
            roleValues = await RoleModel.find();
        })

        // Delete all users from DB and initialize users
        await UserModel.deleteMany({}).then(async result => {
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
        })
    }

    public async getUsers(): Promise<UserData[] | null> {
        
        if(this.roles.length == 0) this.roles = await RoleModel.find();  

        return (await UserModel.find()).map(user => {
            return this.convertToUserData(user);
        });
    }

    public async getUserById(userId: string): Promise<UserData | null> {
        
        if(this.roles.length == 0) this.roles = await RoleModel.find();

        const user: any = await UserModel.findOne({ _id: userId });

        if(!user) return null;
        return this.convertToUserData(user);
    }

    /* Method to be used to hide user password and retrieve full role data */
    private convertToUserData(user: any){   // Setting parameter type to User doesn't allow fetching hidden field '_id'

        let foundRole = this.roles.find((role: Option) => role.value == user.role);
        if(!foundRole) throw Error("Role value "+user.role+" not found!");
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: foundRole
        };
    }
}