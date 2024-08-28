import { NextFunction, Request, Response } from "express";
import { AuthService } from "../auth.service";

const authService = new AuthService;

export async function authenticatedUser(request: Request, response: Response, next: NextFunction) {
    
    // Check if request has access token

    const accessToken: string | null = request.headers['access_token'] as string | null;

    if(!accessToken) {
        response.status(401);
        response.send({
            error: "Missing authorization token in header. Endpoint "+request.url+" requires authentication"
        });
        return;
    }

    // Check if access token is valid (not expired, contains correct user id)

    try {
        const isValidAccessToken = await authService.isAccessTokenValid(accessToken);
        if(isValidAccessToken) {
            next();
        }
    }
    catch (error: any) {
        response.status(401);
        response.send({
            error: error.message
        });
    }
}