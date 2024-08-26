import { json, Router } from 'express';
import { UserModel } from '../models/user.model';

const userRouter = Router();

userRouter.use(json());

userRouter.get("/", async (request, response) => {

    const users = await UserModel.find();    
    response.send(users);

});

userRouter.get("/:userId", async (request, response) => {
    const user = await UserModel.findOne({ _id: request.params.userId });
    response.send(user);
});

export default userRouter;