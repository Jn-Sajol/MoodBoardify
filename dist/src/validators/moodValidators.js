"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moodRecommendationSchema = exports.moodSchema = exports.Moods = void 0;
const zod_1 = require("zod");
// Enum for TypeScript validation
var Moods;
(function (Moods) {
    Moods["HAPPY"] = "HAPPY";
    Moods["SAD"] = "SAD";
    Moods["ANGRY"] = "ANGRY";
    Moods["EXCITED"] = "EXCITED";
    Moods["CALM"] = "CALM";
    Moods["ANXIOUS"] = "ANXIOUS";
    Moods["NERVOUS"] = "NERVOUS";
    Moods["RELAXED"] = "RELAXED";
    Moods["CONFIDENT"] = "CONFIDENT";
    Moods["FRUSTRATED"] = "FRUSTRATED";
    Moods["BORED"] = "BORED";
    Moods["HOPEFUL"] = "HOPEFUL";
    Moods["GRATEFUL"] = "GRATEFUL";
    Moods["LONELY"] = "LONELY";
    Moods["TIRED"] = "TIRED";
    Moods["ENERGETIC"] = "ENERGETIC";
    Moods["CURIOUS"] = "CURIOUS";
    Moods["SCARED"] = "SCARED";
    Moods["LOVE"] = "LOVE";
    Moods["GUILTY"] = "GUILTY";
    Moods["SHY"] = "SHY";
})(Moods || (exports.Moods = Moods = {}));
// ✅ Define Zod Schema
exports.moodSchema = zod_1.z.object({
    userId: zod_1.z.number().int().positive(), // Must be a positive integer
    mood: zod_1.z.nativeEnum(Moods), // Must be a valid enum value
});
exports.moodRecommendationSchema = zod_1.z.object({
    mood: zod_1.z.string().min(2, "Mood must be needed"),
});
