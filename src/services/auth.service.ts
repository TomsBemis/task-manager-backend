import { Request } from "express";
import { AuthCredentials, User, UserModel } from "../models/user.model";
    
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

export class AuthService {

    async authenticateUser(userId : string) : Promise<AuthCredentials> {
        
        if(process.env.AUTH_TOKEN_SECRET && process.env.AUTH_TOKEN_TIMESPAN) {
            const tokenTimespan = +(process.env.AUTH_TOKEN_TIMESPAN ?? 0) * 1000;
            const generatedAccessToken = this.getAuthToken(userId, tokenTimespan);
            const generatedRefreshToken = this.getAuthToken(userId, null);

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

    // Compare JWT access token by taking user id in JWT content and checking if user data matches
    public async isAccessTokenValid(accessToken: string): Promise<{ userId: string, user: User} | null> {
        return jwt.verify(accessToken, process.env.AUTH_TOKEN_SECRET as string, async (error: Error, tokenContent: any) => {

            if (error) throw Error("Invalid JSON web token: " + error.message);
            const fetchedUser: User | null = await UserModel.findById(tokenContent.userId);
            if (!fetchedUser) throw Error("Invalid JSON web token: could not find user by ID provided in token");
            if (accessToken !== fetchedUser.accessToken) throw Error("Invalid JSON web token: specified user has different access token");

            return {
                userId: tokenContent.userId,
                user: fetchedUser
            };    // All conditions for valid access token are met
        });
    }

    public async removeUserToken(userId: string): Promise<void> {
        
        // Update user token and expiration date in DB
        await UserModel.findOneAndUpdate(
            { _id: userId },
            { $set: { 
                accessToken: "",
                refreshToken: "",
                }},
            { new: true }
        );
    }

    async isUserValid(inputUsername: string, inputPassword: string): Promise<User | null> {
        const fetchedUser = await UserModel.findOne({ username: inputUsername });

        if(!fetchedUser) throw Error("User with username '"+inputUsername+"' not found");

        const valid =  await bcrypt.compare(inputPassword, fetchedUser?.password);

        if(valid) return fetchedUser;
        else throw Error("Invalid user password");
    }

    private getAuthToken(userId : string, tokenTimespan : number | null) {
        if (!tokenTimespan) return jwt.sign({userId: userId}, process.env.AUTH_TOKEN_SECRET);
        return jwt.sign({userId: userId}, process.env.AUTH_TOKEN_SECRET, { expiresIn: tokenTimespan });
    }
}