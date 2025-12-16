import { Role } from "../models/role.model";

export const initialRoles: {[key: string]: Role} = {
    REGULAR_USER: {"name": "REGULAR_USER"},
    MANAGER: {"name": "MANAGER"},
    ADMIN: {"name": "ADMIN"},
};

export const initialUsers = [
    {"_id": "66b34f4f46a0bb66b0a7fb2b", "username" : "test-user", "password" : "1234", "firstName" : "Test", "lastName" : "User", "roles": ["REGULAR_USER"]},
    {"_id": "66ed41d27822146baf0336b1", "username" : "test-manager", "password" : "1234", "firstName" : "Test", "lastName" : "Manager", "roles": ["REGULAR_USER", "MANAGER"]},
    {"_id": "66ed41d27822146baf0336af", "username" : "test-admin", "password" : "1234", "firstName" : "Test", "lastName" : "Admin", "roles": ["REGULAR_USER", "ADMIN"]},
];