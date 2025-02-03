import { Request, Response } from "express";
import { prisma } from "../Db/db.config";
import { compare, hashSync } from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

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


    //LOginUser
    export const loginUser = async (req: Request, res: Response) => {
        try {
          const { email, password } = req.body;
          if (!email && !password) {
            throw new Error("email and name is required");
          }
          const user = await prisma.user.findFirst({
            where: {
              email: email,
            },
          });
      
          if (!user) {
            throw new Error("User not Found");
          }
      
          const valid = await compare(password, user.password);
          if (!valid) {
            throw new Error("Invalid Credential");
          }
      
          const token = jwt.sign({ id: user.id }, "secretkey", {
            expiresIn: "24h",
          });
          res.status(StatusCodes.OK).json({
            success: true,
            message: "User Login Successfully",
            user: {
              id: user.id,
              name: user.username,
              email: user.email,
            },
            token: token,
          });
        } catch (error: any) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error && error.message ? error.message : "server error",
          });
        }
      };
      
    