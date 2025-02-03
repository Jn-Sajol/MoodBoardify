import { Request, Response } from "express";
import { prisma } from "../Db/db.config";
import { hashSync } from "bcrypt";
import { StatusCodes } from "http-status-codes";

export const createUser = async (req: Request, res: Response) => {
    const {
        username,
        email,
        password,
      } = req.body;
    
      try {
        if (
          !username &&
          !email &&
          !password
        ) {
          res.send("email and name is required");
        }
        const checkDuplicate = await prisma.user.findFirst({
          where: {
            OR: [{ email }, { username }],
          },
        });
        if (checkDuplicate) {
          throw new Error("already user exist by this");
        }
        const newUser = await prisma.user.create({
          data: {
            username,
            email,
            password: hashSync(password, 10),
          },
        });
        const { password: String, ...others } = newUser;
        res.status(StatusCodes.CREATED).json({
          success: true,
          message: "User has created",
          user: others,
        });
      } catch (error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error && error.message ? error.message : "server error",
        });
      }
    };
    