import { Request } from "express";
import { AuthCredentials, LoginResponse, User, UserData, UserModel } from "./models/user.model";
    
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

export class AuthService {

    async authenticateUser(userId : string) : Promise<AuthCredentials> {
        
        if(process.env.AUTH_TOKEN_SECRET && process.env.AUTH_TOKEN_TIMESPAN) {
            const tokenTimespan = +(process.env.AUTH_TOKEN_TIMESPAN ?? 0) * 1000;
            const generatedAccessToken = this.getAuthToken(userId, tokenTimespan);
            const generatedRefreshToken = this.getAuthToken(userId, null);

            // Set token and expiration date
            // const authenticatedUser = (await UserModel.find())
            // .filter(user => user.id == userId)
            // .map(user => {
            //     user.token = generatedAccessToken;
            //     user.tokenExpirationDate = new Date(Date.now() + tokenTimespan);
            //     return user;
            // })[0];

            // Update user token and expiration date in DB
            await UserModel.findOneAndUpdate(
                { _id: userId },
                { $set: {
                    accessToken: generatedAccessToken,
                    refreshToken: generatedRefreshToken
                }},
                { new: true }
            );

            return {
                accessToken : generatedAccessToken,
                refreshToken : generatedRefreshToken,
                userId : userId,
            };
        }
        else {
            throw new Error("Authentication token settings not configured");
        }
        
    }

    public async getUserById(userId: string): Promise<UserData | null> {
        return await UserModel.findById(userId);
    }

    public async removeUserToken(userId: string): Promise<void> {
        
        // Update user token and expiration date in DB
        await UserModel.findOneAndUpdate(
            { _id: userId },
            { $set: { token: "" } },
            { new: true }
        );
    }

    async isUserValid(request: Request): Promise<User | null> {
        const fetchedUser = await UserModel.findOne({ username: request.body.username });

        const valid =  await bcrypt.compare(request.body.password, fetchedUser?.password);

        if(valid) return fetchedUser;
        else throw Error("Invalid user password");
    }

    private getAuthToken(userId : string, tokenTimespan : number | null) {
        if (!tokenTimespan) return jwt.sign({userId: userId}, process.env.AUTH_TOKEN_SECRET);
        return jwt.sign({userId: userId}, process.env.AUTH_TOKEN_SECRET, { expiresIn: tokenTimespan });
    }

    public verifyToken(request : Request) : { valid: boolean, message : string} {
        const token = request.headers['authorization'];

        if (!token) {
            return {
                valid : false,
                message : "Missing JWT in 'authorization' header."
            };
        }

        jwt.verify(token, process.env.AUTH_TOKEN_SECRET as string, (error: Error, user: any) => {
            

            if (error) {
                return {
                    valid : false,
                    message : error.message
                };
            }
        });

        return {
            valid : true,
            message : "JWT is valid."
        }
    }
}