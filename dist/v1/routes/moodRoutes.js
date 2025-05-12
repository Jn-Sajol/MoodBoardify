"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const moodBoardController_1 = require("../../controllers/moodBoardController");
const moodRouter = express_1.default.Router();
moodRouter.post('/createmood', authMiddleware_1.userAuth, moodBoardController_1.createMood);
moodRouter.get('/history/:userId/:days?', authMiddleware_1.userAuth, moodBoardController_1.moodHistoryByDate);
// moodRouter.get('/protected',userAuth, checkauth)
// moodRouter.post('/login', userLogin)
exports.default = moodRouter;
