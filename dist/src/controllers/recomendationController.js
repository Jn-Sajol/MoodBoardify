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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendation = void 0;
const openai_1 = __importDefault(require("openai"));
const moodValidators_1 = require("../validators/moodValidators");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
// const moodDatabase: Record<string, any> = {
//   Happy: {
//     songs: ["Happy - Pharrell Williams", "Don't Stop Me Now - Queen"],
//     movies: ["Inside Out", "The Secret Life of Walter Mitty"],
//     activities: ["Go for a walk", "Dance to your favorite music"],
//   },
//   Sad: {
//     songs: ["Fix You - Coldplay", "Someone Like You - Adele"],
//     movies: ["The Pursuit of Happyness", "A Beautiful Mind"],
//     activities: ["Write in a journal", "Watch a comedy show"],
//   },
// };
const recommendation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = moodValidators_1.moodRecommendationSchema.safeParse(req.body);
    if (!validation.success) {
        return res
            .status(400)
            .json({ error: "Invalid input", details: validation.error.errors });
    }
    const { mood } = validation.data;
    // if (moodDatabase[mood]) {
    //   return res.json({ mood, recommendations: moodDatabase[mood] });
    // }
    try {
        const response = yield openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: `User is feeling ${mood}. Provide **new** recommendations in the following JSON format, ensuring they are different based on the mood:
         {
  "songs": [
    { "title": "Song Name", "link": "YouTube Link", "avatar": "Image URL" }
    { "title": "Song Name", "link": "YouTube Link", "avatar": "Image URL" }
    { "title": "Song Name", "link": "YouTube Link", "avatar": "Image URL" }
    { "title": "Song Name", "link": "YouTube Link", "avatar": "Image URL" }
  ],
  "movies": [
    { "title": "Movie Name", "link": "IMDB Link", "avatar": "Image URL" }
    { "title": "Movie Name", "link": "IMDB Link", "avatar": "Image URL" }
    { "title": "Movie Name", "link": "IMDB Link", "avatar": "Image URL" }
    { "title": "Movie Name", "link": "IMDB Link", "avatar": "Image URL" }
  ],
  "books": [
    { "title": "Book Name", "link": "Goodreads Link", "avatar": "Image URL" }
    { "title": "Book Name", "link": "Goodreads Link", "avatar": "Image URL" }
    { "title": "Book Name", "link": "Goodreads Link", "avatar": "Image URL" }
    { "title": "Book Name", "link": "Goodreads Link", "avatar": "Image URL" }
  ],
  "quotes": [
    { "text": "Inspirational Quote", "author": "Author Name" }
    { "text": "Inspirational Quote", "author": "Author Name" }
    { "text": "Inspirational Quote", "author": "Author Name" }
    { "text": "Inspirational Quote", "author": "Author Name" }
  ],
  "activities": [
    { "title": "Activity Name", "link": "Related Link", "avatar": "Image URL" }
    { "title": "Activity Name", "link": "Related Link", "avatar": "Image URL" }
    { "title": "Activity Name", "link": "Related Link", "avatar": "Image URL" }
    { "title": "Activity Name", "link": "Related Link", "avatar": "Image URL" }
  ]
}`,
                },
            ],
            response_format: { type: "json_object" },
            max_tokens: 2000,
        });
        const content = response.choices[0].message.content;
        if (!content) {
            return res.status(500).json({ error: "AI response is empty." });
        }
        let aiResponse;
        try {
            aiResponse = JSON.parse(content);
        }
        catch (error) {
            return res.status(500).json({ error: "Failed to parse AI response." });
        }
        res.json({ mood, recommendations: aiResponse });
    }
    catch (error) {
        console.error("Error details:", error);
        res
            .status(500)
            .json({ error: "AI Recommendation Failed", details: error.message });
    }
});
exports.recommendation = recommendation;
