import { Request, Response } from "express";
import OpenAI from "openai";
import { moodRecommendationSchema } from "../validators/moodValidators";

const openai = new OpenAI({
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

export const recommendation = async (req: Request, res: Response) => {
  const validation = moodRecommendationSchema.safeParse(req.body);
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
    const response = await openai.chat.completions.create({
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
    } catch (error) {
      return res.status(500).json({ error: "Failed to parse AI response." });
    }

    res.json({ mood, recommendations: aiResponse });
  } catch (error: any) {
    console.error("Error details:", error);
    res
      .status(500)
      .json({ error: "AI Recommendation Failed", details: error.message });
  }
};
