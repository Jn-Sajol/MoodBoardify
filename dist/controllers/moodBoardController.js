"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moodHistoryByDate = exports.createMood = void 0;
const db_config_1 = require("../Db/db.config");
const moodValidators_1 = require("../validators/moodValidators");
const appError_1 = require("../utils/appError");
const createMood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Validate the request body using Zod
    const validation = moodValidators_1.moodSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ error: validation.error.format() });
        return;
    }
    const { userId, mood } = validation.data;
    try {
        const moodEntry = yield db_config_1.prisma.mood.create({
            data: {
                userId,
                mood,
            },
        });
        res.json(moodEntry);
    }
    catch (error) {
        next(new appError_1.AppError("server error", 500));
    }
});
exports.createMood = createMood;
// Mood History
const moodHistoryByDate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.userId);
    const daysParam = req.params.days;
    // Validate userId and days
    if (isNaN(userId) || isNaN(Number(daysParam)) || Number(daysParam) <= 0) {
        res.status(400).json({
            error: "Invalid parameters. User ID must be a number, and days must be a positive number.",
        });
        return;
    }
    const days = Number(daysParam);
    try {
        // ✅ Calculate start date based on `days` parameter
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - (days - 1)); // Go back `days-1` to include today
        const moods = yield db_config_1.prisma.mood.findMany({
            where: {
                userId,
                timestamp: {
                    gte: startDate, // Start from `days` ago
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // End at today 23:59
                },
            },
            orderBy: { timestamp: "asc" },
        });
        // **Group by Date**
        const groupedMoods = {};
        moods.forEach((entry) => {
            const date = entry.timestamp.toISOString().split("T")[0]; // Extract YYYY-MM-DD
            if (!groupedMoods[date]) {
                groupedMoods[date] = {}; // Initialize date group
            }
            if (!groupedMoods[date][entry.mood]) {
                groupedMoods[date][entry.mood] = 0; // Initialize mood count
            }
            groupedMoods[date][entry.mood] += 1; // Increment mood count
        });
        // Convert to array for response
        const result = Object.keys(groupedMoods).map((date) => ({
            date,
            moods: groupedMoods[date],
        }));
        res.json(result);
    }
    catch (error) {
        next(new appError_1.AppError("Error fetching moods", 500));
    }
});
exports.moodHistoryByDate = moodHistoryByDate;
