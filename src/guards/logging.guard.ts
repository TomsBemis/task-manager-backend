import { NextFunction, Request, Response } from "express";

export function logToConsole(request: Request, response: Response, next: NextFunction) {
    console.log({
        "Logging guard log": {
            request: request
        }
    });
    next();
}