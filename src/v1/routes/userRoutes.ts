
import express from "express";
import { checkauth, createUser, getSingleUserWithMoods, loginUser } from "../../controllers/userControllers";
import { userAuth } from "../../middleware/authMiddleware";
const userRouter = express.Router();

userRouter.post('/register', createUser)
userRouter.post('/login', loginUser)
userRouter.get('/singleuser/:id',userAuth, getSingleUserWithMoods)
// userRouter.post('/login', userLogin)


export default userRouter;