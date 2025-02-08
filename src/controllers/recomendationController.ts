import { Request, Response } from "express";
import OpenAI from "openai";
import { z } from "zod"; // Import Zod for validation

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure API key is set in .env
});

// Define schema for request validation
const moodSchema = z.object({
  mood: z.string().min(2, "Mood must be at least 2 characters long"),
});

// AI-Based Mood Recommendation API
export const recommendation = async (req: Request, res: Response) => {
  // Validate request body using Zod
  const validation = moodSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid input", details: validation.error.errors });
  }

  const { mood } = validation.data;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use the latest GPT-4 Omni model
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `I am feeling ${mood}. Suggest 3 things I should do to improve my mood.` },
      ],
      max_tokens: 100,
    });

    res.json({ recommendation: response.choices[0].message });
  } catch (error: any) {
    console.error("Error details:", error);
    res.status(500).json({ error: "AI Recommendation Failed", details: error.message });
  }
};
