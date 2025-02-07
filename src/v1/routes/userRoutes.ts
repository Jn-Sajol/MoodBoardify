
import express from "express";
import { checkauth, createUser, loginUser } from "../../controllers/userControllers";
import { userAuth } from "../../middleware/authMiddleware";
const userRouter = express.Router();

userRouter.post('/register', createUser)
userRouter.post('/login', loginUser)
userRouter.get('/protected',userAuth, checkauth)
// userRouter.post('/login', userLogin)


export default userRouter;