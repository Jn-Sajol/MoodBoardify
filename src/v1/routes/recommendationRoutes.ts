import express from "express";
import { userAuth } from "../../middleware/authMiddleware";
import { recommendation } from "../../controllers/recomendationController";
const recommendationRouter = express.Router();

recommendationRouter.post('/recommendation', recommendation)

// recommendationRouter.post('/login', userLogin)


export default recommendationRouter;