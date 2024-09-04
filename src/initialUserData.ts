import { Option } from "./models/option.model";

export const initialRoles: {[key: string]: Option} = {
    user : {
        value: "USER",
        displayName: "Regular user"
    },
    manager: {
        value: "MANAGER",
        displayName: "Manager"
    },
    admin: {
        value: "ADMIN",
        displayName: "Administrator"
    },
}

export const initialUsers = [
    {"_id": "66b34f4f46a0bb66b0a7fb2b", "username" : "test-user", "password" : "1234", "firstName" : "Test", "lastName" : "User", "role": "USER"},
    {"_id": "66b34f4f46a0bb66b0a7fb2b", "username" : "test-manager", "password" : "1234", "firstName" : "Test", "lastName" : "Manager", "role": "MANAGER"},
    {"_id": "66b34f4f46a0bb66b0a7fb2b", "username" : "test-admin", "password" : "1234", "firstName" : "Test", "lastName" : "Admin", "role": "ADMIN"},
];