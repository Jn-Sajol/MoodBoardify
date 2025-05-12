"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const feedPostController_1 = require("src/controllers/feedPostController");
const feedPostRouter = express_1.default.Router();
feedPostRouter.post('/postfeed', authMiddleware_1.userAuth, feedPostController_1.createPost);
feedPostRouter.get('/getfeeds', feedPostController_1.getAllPublicPosts);
feedPostRouter.post("/comment", authMiddleware_1.userAuth, feedPostController_1.createComment);
feedPostRouter.get("/comment/:postId", feedPostController_1.getCommentsByPost);
// moodRouter.get('/protected',userAuth, checkauth)
// moodRouter.post('/login', userLogin)
exports.default = feedPostRouter;
