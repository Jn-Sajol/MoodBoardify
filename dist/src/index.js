"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const userRoutes_1 = __importDefault(require("./v1/routes/userRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const moodRoutes_1 = __importDefault(require("./v1/routes/moodRoutes"));
const recommendationRoutes_1 = __importDefault(require("./v1/routes/recommendationRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//routes
app.use('/api/v1/user', userRoutes_1.default);
app.use('/api/v1/mood', moodRoutes_1.default);
app.use('/api/v1/mood', recommendationRoutes_1.default);
//Error Handler
app.use(errorHandler_1.errorHandler);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
