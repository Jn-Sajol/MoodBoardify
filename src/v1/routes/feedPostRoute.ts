import express from "express";
import { userAuth } from "../../middleware/authMiddleware";
import { createComment, createPost, getAllPublicPosts, getCommentsByPost } from "src/controllers/feedPostController";
const feedPostRouter = express.Router();

feedPostRouter.post('/postfeed',userAuth, createPost)
feedPostRouter.get('/getfeeds', getAllPublicPosts);
feedPostRouter.post("/comment", userAuth, createComment);
feedPostRouter.get("/comment/:postId", getCommentsByPost);

// moodRouter.get('/protected',userAuth, checkauth)
// moodRouter.post('/login', userLogin)


export default feedPostRouter;