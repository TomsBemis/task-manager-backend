import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import { dbConnect } from "./configs/db.config";
import taskRouter from "./routers/task.router";

dotenv.config();
dbConnect();

const app = express();
app.use(cors({
    credentials: true,
    origin:["http://localhost:4200"]
}));

app.use("/api", taskRouter);

const port = 5000;
app.listen(port, () => {
    console.log('Server started on http://localhost:'+port);
});