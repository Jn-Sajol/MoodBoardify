"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../../controllers/userControllers");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const userRouter = express_1.default.Router();
userRouter.post('/register', userControllers_1.createUser);
userRouter.post('/login', userControllers_1.loginUser);
userRouter.get('/singleuser/:id', authMiddleware_1.userAuth, userControllers_1.getSingleUserWithMoods);
// userRouter.post('/login', userLogin)
exports.default = userRouter;
