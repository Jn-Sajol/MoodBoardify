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
