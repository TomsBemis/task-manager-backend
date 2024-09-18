import { NextFunction, Request, Response } from "express";
import { Option } from '../models/option.model';
import { AuthenticatedUser } from "../models/user.model";

// Route guard for whitelisting or blacklisting users with specified roles
export const userRoleGuard = (criteriaRoles: Option[], whitelist: boolean) => {
    return (request: Request, response: Response, next: NextFunction) => {

        // Fetch user that was appended to the request by auth guard
        const authenticatedUser: AuthenticatedUser = request.body['authenticatedUser'];
        if(!authenticatedUser) {
            response.status(500);
            response.json({ error: "Internal Server Error" });
            return;
        }

        // Check if user has appropriate role
        let matchingRoleFound: boolean = false;

        criteriaRoles.every(criteriaRole => {
            if(criteriaRole.value == authenticatedUser.user.role) matchingRoleFound = true;
        });

        // If role is whitelisted and found in user's roles then allow access
        // If role is blacklisted deny access if the user has it
        if (whitelist && matchingRoleFound || !whitelist && !matchingRoleFound) {
            next();
            return;
        }
        else {
            response.status(401);
            response.json({ error: 
                "Only users with roles "+
                criteriaRoles.map(criteriaRole => "'"+criteriaRole.displayName+"'").join(", ")+
                " are allowed to access this route"
            });
            return;
        }
    }
}