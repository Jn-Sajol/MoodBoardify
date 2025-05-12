import { z } from "zod";

export const postSchema = z.object({
  mood: z.string().min(1, "Mood is required"),
  message: z.string().min(1, "Message is required"),
});
