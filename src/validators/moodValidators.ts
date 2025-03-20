import { z } from "zod";

// Enum for TypeScript validation
export enum Moods {
  HAPPY = "HAPPY",
  SAD = "SAD",
  ANGRY = "ANGRY",
  EXCITED = "EXCITED",
  CALM = "CALM",
  ANXIOUS = "ANXIOUS",
  NERVOUS = "NERVOUS",
  RELAXED = "RELAXED",
  CONFIDENT = "CONFIDENT",
  FRUSTRATED = "FRUSTRATED",
  BORED = "BORED",
  HOPEFUL = "HOPEFUL",
  GRATEFUL = "GRATEFUL",
  LONELY = "LONELY",
  TIRED = "TIRED",
  ENERGETIC = "ENERGETIC",
  CURIOUS = "CURIOUS",
  SCARED = "SCARED",
  LOVE = "LOVE",
  GUILTY = "GUILTY",
  SHY = "SHY",
}

// ✅ Define Zod Schema
export const moodSchema = z.object({
  userId: z.number().int().positive(), // Must be a positive integer
  mood: z.nativeEnum(Moods), // Must be a valid enum value
});


export const moodRecommendationSchema = z.object({
  mood: z.string().min(2, "Mood must be needed"),
});
