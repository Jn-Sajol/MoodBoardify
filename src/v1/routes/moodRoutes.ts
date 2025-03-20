import express from "express";
import { userAuth } from "../../middleware/authMiddleware";
import { createMood, moodHistoryByDate } from "../../controllers/moodBoardController";
const moodRouter = express.Router();

moodRouter.post('/createmood',userAuth, createMood)
moodRouter.get('/history/:userId/:days?', userAuth, moodHistoryByDate);

// moodRouter.get('/protected',userAuth, checkauth)
// moodRouter.post('/login', userLogin)


export default moodRouter;