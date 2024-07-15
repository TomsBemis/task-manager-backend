import express from "express";
import cors from "cors";

const app = express();
app.use(cors({
    credentials: true,
    origin:["http://localhost:4200"]
}));

const port = 5000;
app.listen(port, () => {
    console.log('Server started on http://localhost:'+port);
});