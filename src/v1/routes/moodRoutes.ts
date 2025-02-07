import express from "express";
import { userAuth } from "../../middleware/authMiddleware";
import { createMood } from "../../controllers/moodBoardController";
const moodRouter = express.Router();

moodRouter.post('/createmood',userAuth, createMood)
// moodRouter.post('/login', loginUser)
// moodRouter.get('/protected',userAuth, checkauth)
// moodRouter.post('/login', userLogin)


export default moodRouter;