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
        return res.status(400).json({ error: validation.error.format() });
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
        next(new appError_1.AppError('server error', 500));
    }
});
exports.createMood = createMood;
// Mood History 
const moodHistoryByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.userId);
    const daysParam = req.params.days;
    const days = daysParam ? parseInt(daysParam) : 7;
    if (isNaN(userId) || isNaN(days) || days <= 0) {
        return res.status(400).json({ error: "Invalid parameters. User ID must be a number, and days must be a positive number." });
    }
    try {
        // Define date range
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        const startDate = new Date(endDate.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        console.log("Fetching moods from:", startDate.toISOString(), "to", endDate.toISOString());
        const moods = yield db_config_1.prisma.mood.findMany({
            where: {
                userId,
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { timestamp: "asc" },
        });
        console.log("Fetched Moods:", moods);
        // **Group moods by date**
        const groupedMoods = {};
        moods.forEach((entry) => {
            const date = entry.timestamp.toISOString().split("T")[0];
            if (!groupedMoods[date])
                groupedMoods[date] = {};
            if (!groupedMoods[date][entry.mood])
                groupedMoods[date][entry.mood] = 0;
            groupedMoods[date][entry.mood] += 1;
        });
        // Convert to percentage for each day
        const result = Object.keys(groupedMoods).map((date) => {
            const moodCounts = groupedMoods[date];
            const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
            const moodPercentages = Object.keys(moodCounts).reduce((acc, mood) => {
                acc[mood] = parseFloat(((moodCounts[mood] / total) * 100).toFixed(2));
                return acc;
            }, {});
            return {
                date,
                moods: moodPercentages,
            };
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching moods" });
    }
});
exports.moodHistoryByDate = moodHistoryByDate;
