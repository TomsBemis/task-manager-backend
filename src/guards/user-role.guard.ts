import { NextFunction, Request, Response } from "express";
import { Option } from '../models/option.model';
import { User } from "../models/user.model";

// Route guard for whitelisting or blacklisting users with specified roles
export const userRoleGuard = (criteriaRoles: Option[], whitelist: boolean) => {
    return (request: Request, response: Response, next: NextFunction) => {

        // Fetch user that was appended to the request by auth guard
        const authenticatedUser: User = request.body['authenticatedUser'];
        if(!authenticatedUser) {
            response.status(500);
            response.json({ error: "Internal Server Error" });
            return;
        }

        if(whitelist) { // If at least one of the roles matches then allow the user access to the route
            for (let i = 0; i < criteriaRoles.length; i++) {
                if(criteriaRoles[i].value == authenticatedUser.role) {
                    next();
                    return;
                }
            }
            response.status(401);
            response.json({ error: 
                "Only users with roles "+
                criteriaRoles.map(criteriaRole => "'"+criteriaRole.displayName+"'").join(", ")+
                " are allowed to access this route"
            });
            return;
        }
        else {  // If at least one of the roles matches then the user is blacklisted to access the route      
            for (let i = 0; i < criteriaRoles.length; i++) {
                if(criteriaRoles[i].value == authenticatedUser.role) {
                    response.status(401);
                    response.json({ error: "Users with user role '"+criteriaRoles[i].displayName+"' are not allowed to access this resource." });
                    return;
                }
            }
            next();
        }
        return;
    }
}