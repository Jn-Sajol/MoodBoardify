import { NextFunction, Request, Response } from "express";
import { prisma } from "../Db/db.config";
import { moodSchema } from "../validators/moodValidators";
import { AppError } from "../utils/appError";

export const createMood = async (req: Request, res: Response, next:NextFunction) => {
    // ✅ Validate the request body using Zod
    const validation = moodSchema.safeParse(req.body);
  
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }
  
    const { userId, mood } = validation.data;
  
    try {
      const moodEntry = await prisma.mood.create({
        data: {
          userId,
          mood,
        },
      });
  
      res.json(moodEntry);
    } catch (error) {
      next(new AppError('server error',500))
    }
  };


  // Mood History 
  export const moodHistoryByDate =  async (req: Request, res: Response) => {
   const userId = Number(req.params.userId);
  const daysParam = req.params.days;
  
  // Extract numeric value from `7d` or `30d`
  const days = daysParam ? parseInt(daysParam) : 7;

  if (isNaN(userId) || isNaN(days) || days <= 0) {
    return res.status(400).json({ error: "Invalid parameters. User ID must be a number, and days must be a positive number." });
  }

    try {
      const moods = await prisma.mood.findMany({
        where: {
          userId,
          timestamp: { gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000) },
        },
        orderBy: { timestamp: "asc" },
      });
  
      // **Group by Date**
      const groupedMoods: { [date: string]: { [mood: string]: number } } = {};
  
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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching moods" });
    }
  }
