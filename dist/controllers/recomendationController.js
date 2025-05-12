"use strict";
// import { Request, Response } from "express";
// import OpenAI from "openai";
// import { moodRecommendationSchema } from "../validators/moodValidators";
// import dotenv from "dotenv";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendation = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const moodValidators_1 = require("../validators/moodValidators");
// Load env variables
dotenv_1.default.config();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
}
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
const recommendation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const validation = moodValidators_1.moodRecommendationSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ error: "Invalid input", details: validation.error.errors });
        return;
    }
    const { mood } = validation.data;
    const prompt = `User is feeling ${mood}. Provide **new** recommendations in the following JSON format. Do not include any markdown or backticks — respond with plain JSON only:

{
  "songs": [
    { "title": "Song Name", "link": "YouTube Link", "avatar": "Image URL" },
    { "title": "Song Name", "link": "YouTube Link", "avatar": "Image URL" },
    { "title": "Song Name", "link": "YouTube Link", "avatar": "Image URL" },
    { "title": "Song Name", "link": "YouTube Link", "avatar": "Image URL" }
  ],
  "movies": [
    { "title": "Movie Name", "link": "IMDB Link", "avatar": "Image URL" },
    { "title": "Movie Name", "link": "IMDB Link", "avatar": "Image URL" },
    { "title": "Movie Name", "link": "IMDB Link", "avatar": "Image URL" },
    { "title": "Movie Name", "link": "IMDB Link", "avatar": "Image URL" }
  ],
  "books": [
    { "title": "Book Name", "link": "Goodreads Link", "avatar": "Image URL" },
    { "title": "Book Name", "link": "Goodreads Link", "avatar": "Image URL" },
    { "title": "Book Name", "link": "Goodreads Link", "avatar": "Image URL" },
    { "title": "Book Name", "link": "Goodreads Link", "avatar": "Image URL" }
  ],
  "quotes": [
    { "text": "Inspirational Quote", "author": "Author Name" },
    { "text": "Inspirational Quote", "author": "Author Name" },
    { "text": "Inspirational Quote", "author": "Author Name" },
    { "text": "Inspirational Quote", "author": "Author Name" }
  ],
  "activities": [
    { "title": "Activity Name", "link": "Related Link", "avatar": "Image URL" },
    { "title": "Activity Name", "link": "Related Link", "avatar": "Image URL" },
    { "title": "Activity Name", "link": "Related Link", "avatar": "Image URL" },
    { "title": "Activity Name", "link": "Related Link", "avatar": "Image URL" }
  ]
}`;
    try {
        const response = yield axios_1.default.post(GEMINI_API_URL, {
            contents: [
                {
                    parts: [{ text: prompt }],
                },
            ],
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const rawText = ((_e = (_d = (_c = (_b = (_a = response.data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || "";
        let aiResponse;
        try {
            const cleaned = rawText
                .trim()
                .replace(/```json\s*|```/g, "") // Remove ```json or ```
                .trim();
            aiResponse = JSON.parse(cleaned);
        }
        catch (err) {
            res.status(500).json({
                error: "Failed to parse Gemini response as JSON",
                raw: rawText,
            });
            return;
        }
        res.json({ mood, recommendations: aiResponse });
    }
    catch (error) {
        console.error("Gemini API error:", ((_f = error.response) === null || _f === void 0 ? void 0 : _f.data) || error.message);
        res.status(500).json({
            error: "Gemini AI Recommendation Failed",
            details: ((_g = error.response) === null || _g === void 0 ? void 0 : _g.data) || error.message,
        });
    }
});
exports.recommendation = recommendation;
