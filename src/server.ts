import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import { dbConnect } from "./configs/db.config";
import taskRouter from "./routers/task.router";
import authRouter from "./routers/auth.router";
import userRouter from "./routers/user.router";
import { UserService } from "./services/user.service";
import { TaskService } from "./services/task.service";

dotenv.config();
dbConnect();

const app = express();
app.use(cors({
    credentials: true,
    origin:["http://localhost:4200"]
}));

app.use("/api/tasks", taskRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

const port = 5000;
app.listen(port, () => {
    console.log('Server started on http://localhost:'+port);
});

// Initialize app
try {
    UserService.initializeUsers();
    TaskService.initializeTasks();
    console.log("DB Initialized");
}
catch (error: any) {
    console.log("Error initializing DB: "+error.message);
}

export class InternalError extends Error {
    constructor(message: string) {
      super(message);
    }
}