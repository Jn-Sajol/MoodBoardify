// import { Request, Response } from "express";
// import OpenAI from "openai";
// import { moodRecommendationSchema } from "../validators/moodValidators";
// import dotenv from "dotenv";

// // Load environment variables
// dotenv.config();

// // Verify API key is available
// const apiKey = process.env.OPENAI_API_KEY;
// if (!apiKey) {
//   throw new Error("OPENAI_API_KEY is not defined in environment variables");
// }

// const openai = new OpenAI({
//   apiKey: apiKey,
// });

// // const moodDatabase: Record<string, any> = {
// //   Happy: {
// //     songs: ["Happy - Pharrell Williams", "Don't Stop Me Now - Queen"],
// //     movies: ["Inside Out", "The Secret Life of Walter Mitty"],
// //     activities: ["Go for a walk", "Dance to your favorite music"],
// //   },
// //   Sad: {
// //     songs: ["Fix You - Coldplay", "Someone Like You - Adele"],
// //     movies: ["The Pursuit of Happyness", "A Beautiful Mind"],
// //     activities: ["Write in a journal", "Watch a comedy show"],
// //   },
// // };

// export const recommendation = async (req: Request, res: Response) => {
//   const validation = moodRecommendationSchema.safeParse(req.body);
//   if (!validation.success) {
//     res
//       .status(400)
//       .json({ error: "Invalid input", details: validation.error.errors });
//     return;
//   }

//   const { mood } = validation.data;
//   // if (moodDatabase[mood]) {
//   //   return res.json({ mood, recommendations: moodDatabase[mood] });
//   // }

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         {
//           role: "user",
//           content: `User is feeling ${mood}. Provide **new** recommendations in the following JSON format, ensuring they are different based on the mood:
//          {
//   "songs": [
//     { "title": "Song Name", "link": "YouTube Link", "avatar": "Image URL" }
//     { "title": "Song Name", "link": "YouTube Link", "avatar": "Image URL" }
//     { "title": "Song Name", "link": "YouTube Link", "avatar": "Image URL" }
//     { "title": "Song Name", "link": "YouTube Link", "avatar": "Image URL" }
//   ],
//   "movies": [
//     { "title": "Movie Name", "link": "IMDB Link", "avatar": "Image URL" }
//     { "title": "Movie Name", "link": "IMDB Link", "avatar": "Image URL" }
//     { "title": "Movie Name", "link": "IMDB Link", "avatar": "Image URL" }
//     { "title": "Movie Name", "link": "IMDB Link", "avatar": "Image URL" }
//   ],
//   "books": [
//     { "title": "Book Name", "link": "Goodreads Link", "avatar": "Image URL" }
//     { "title": "Book Name", "link": "Goodreads Link", "avatar": "Image URL" }
//     { "title": "Book Name", "link": "Goodreads Link", "avatar": "Image URL" }
//     { "title": "Book Name", "link": "Goodreads Link", "avatar": "Image URL" }
//   ],
//   "quotes": [
//     { "text": "Inspirational Quote", "author": "Author Name" }
//     { "text": "Inspirational Quote", "author": "Author Name" }
//     { "text": "Inspirational Quote", "author": "Author Name" }
//     { "text": "Inspirational Quote", "author": "Author Name" }
//   ],
//   "activities": [
//     { "title": "Activity Name", "link": "Related Link", "avatar": "Image URL" }
//     { "title": "Activity Name", "link": "Related Link", "avatar": "Image URL" }
//     { "title": "Activity Name", "link": "Related Link", "avatar": "Image URL" }
//     { "title": "Activity Name", "link": "Related Link", "avatar": "Image URL" }
//   ]
// }`,
//         },
//       ],
//       response_format: { type: "json_object" },
//       max_tokens: 2000,
//     });

//     const content = response.choices[0].message.content;
//     if (!content) {
//       res.status(500).json({ error: "AI response is empty." });
//       return;
//     }

//     let aiResponse;
//     try {
//       aiResponse = JSON.parse(content);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to parse AI response." });
//       return;
//     }

//     res.json({ mood, recommendations: aiResponse });
//     return;
//   } catch (error: any) {
//     console.error("Error details:", error);
//     res
//       .status(500)
//       .json({ error: "AI Recommendation Failed", details: error.message });
//   }
// };



import { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import { moodRecommendationSchema } from "../validators/moodValidators";

// Load env variables
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

export const recommendation = async (req: Request, res: Response) => {
  const validation = moodRecommendationSchema.safeParse(req.body);
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
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let aiResponse;
    try {
      const cleaned = rawText
        .trim()
        .replace(/```json\s*|```/g, "") // Remove ```json or ```
        .trim();
      aiResponse = JSON.parse(cleaned);
    } catch (err) {
      res.status(500).json({
        error: "Failed to parse Gemini response as JSON",
        raw: rawText,
      });
      return;
    }

    res.json({ mood, recommendations: aiResponse });
  } catch (error: any) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Gemini AI Recommendation Failed",
      details: error.response?.data || error.message,
    });
  }
};
