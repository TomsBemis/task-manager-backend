import { Option } from "./models/option.model";

export const initialRoles: {[key: string]: Option} = {
    USER : {
        value: "USER",
        displayName: "Regular user"
    },
    MANAGER: {
        value: "MANAGER",
        displayName: "Manager"
    },
    ADMIN: {
        value: "ADMIN",
        displayName: "Administrator"
    },
}

export const initialUsers = [
    {"_id": "66b34f4f46a0bb66b0a7fb2b", "username" : "test-user", "password" : "1234", "firstName" : "Test", "lastName" : "User", "roles": ["USER"]},
    {"_id": "66ed41d27822146baf0336b1", "username" : "test-manager", "password" : "1234", "firstName" : "Test", "lastName" : "Manager", "roles": ["USER", "MANAGER"]},
    {"_id": "66ed41d27822146baf0336af", "username" : "test-admin", "password" : "1234", "firstName" : "Test", "lastName" : "Admin", "roles": ["USER", "ADMIN"]},
];