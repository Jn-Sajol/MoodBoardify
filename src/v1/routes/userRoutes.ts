
import express from "express";
import { createUser, loginUser } from "../../controllers/userControllers";
const userRouter = express.Router();

userRouter.post('/register', createUser)
userRouter.post('/login', loginUser)
// userRouter.post('/login', userLogin)


export default userRouter;