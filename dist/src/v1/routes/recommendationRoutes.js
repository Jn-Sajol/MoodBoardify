"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recomendationController_1 = require("../../controllers/recomendationController");
const recommendationRouter = express_1.default.Router();
recommendationRouter.post('/recommendation', recomendationController_1.recommendation);
// recommendationRouter.post('/login', userLogin)
exports.default = recommendationRouter;
