import { UserModel } from "./models/user.model";
    
const jwt = require('jsonwebtoken');

export class AuthService {

    async authenticateUser(userId : string) {
        
        if(process.env.AUTH_TOKEN_SECRET && process.env.AUTH_TOKEN_TIMESPAN) {

            const generatedToken = this.getAuthToken(userId);

            // Set token and expiration date
            const authenticatedUser = (await UserModel.find())
            .filter(user => user.id == userId)
            .map(user => {
                user.token = generatedToken;
                user.tokenExpirationDate = new Date(Date.now() + +(process.env.AUTH_TOKEN_TIMESPAN ?? 0) * 1000);
                return user;
            })[0];

            // Update user token and expiration date in DB
            await UserModel.findOneAndUpdate(
                { _id: userId },
                { $set: authenticatedUser },
                { new: true }
            );

            return {
                token : generatedToken,
                user : authenticatedUser,
            };
        }
        else {
            console.log("Authentication token settings not configured");
            throw new Error();
        }
        
    }

    private getAuthToken(userId : string) {
        return jwt.sign({userId: userId}, process.env.AUTH_TOKEN_SECRET, { expiresIn: process.env.AUTH_TOKEN_TIMESPAN });
    }
}