import { Request, Response } from "express";
import { prisma } from "../Db/db.config";

interface Moods {
  userId: number;
  mood: string;
}
export const createMood = async (req: Request, res: Response) => {
  const { userId, mood }: Moods = req.body;
  if (!mood) return res.status(400).json({ error: "Mood is required" });

  try {
    const moodEntry = await prisma.mood.create({
      data: { userId, mood },
    });
    res.json(moodEntry);
  } catch {
    res.status(400).json({ error: "Error saving mood" });
  }
};
