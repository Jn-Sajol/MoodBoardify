import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../Db/db.config";

export const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authorization token is missing",
      });
      return 
    }

    const secretKey = process.env.JWT_SECRET || "secretkey"; // Use environment variables for better security
    const verifyToken = jwt.verify(token, secretKey) as { id: string };

    const user = await prisma.user.findUnique({ where: { id: +verifyToken.id } });

    if (!user) {
     res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "User not found",
      });
      return 
    }

    req.user = user; // Attach user to request object for use in subsequent middleware or routes
    next();
  } catch (error) {
     res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid or expired token",
    });
    return 
  }
};