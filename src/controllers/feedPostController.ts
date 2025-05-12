import { Request, Response, NextFunction } from "express";
import { prisma } from "../Db/db.config";
import { postSchema } from "../validators/postValidator";
import { AppError } from "../utils/appError";
import { Moods } from "@prisma/client";

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const validation = postSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.format() });
    return;
  }

  const { mood, message } = validation.data;
  const moodValue = req.body.mood as Moods

  try {
    const post = await prisma.post.create({
      data: {
        userId: Number(req.user?.id),
        mood: moodValue,
        message,
      },
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    next(new AppError("Failed to create post", 500));
  }
};

export const getAllPublicPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    res.json({ success: true, posts });
  } catch (error) {
    next(new AppError("Failed to fetch posts", 500));
  }
};
//comment segment
/** CREATE COMMENT */
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const { postId, content } = req.body;

  if (!postId || !content) {
     res.status(400).json({ error: "postId and content are required" });
     return
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        postId: Number(postId),
        userId: Number(req.user?.id),
        content,
      },
    });

    res.status(201).json({ success: true, comment });
  } catch (error) {
    next(new AppError("Failed to create comment", 500));
  }
};

/** GET COMMENTS FOR A POST */
export const getCommentsByPost = async (req: Request, res: Response, next: NextFunction) => {
  const postId = Number(req.params.postId);

  if (!postId) {
     res.status(400).json({ error: "Invalid post ID" });
     return
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    res.json({ success: true, comments });
  } catch (error) {
    next(new AppError("Failed to fetch comments", 500));
  }
};