import { NextFunction, Request, Response } from "express";
import { prisma } from "../Db/db.config";
import { moodSchema } from "../validators/moodValidators";
import { AppError } from "../utils/appError";

export const createMood = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // ✅ Validate the request body using Zod
  const validation = moodSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.format() });
    return;
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
    next(new AppError("server error", 500));
  }
};

// Mood History
export const moodHistoryByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const moods = await prisma.mood.findMany({
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
    next(new AppError("Error fetching moods", 500));
  }
};


