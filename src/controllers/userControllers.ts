// controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../Db/db.config';
import { compare, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return next(new AppError('name, email, and password are required', 400));
    }
    
    const checkDuplicate = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { name },],
      },
    });

    if (checkDuplicate) {
      return res.send('User already exists with this email or name');
    }
    console.log(' till this one')
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      success: true,
      message: 'User has been created',
      user: userWithoutPassword,
    });
  } catch (error) {
    next(new AppError('Server error', 500));
  }
};

//user Login
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return next(new AppError('Invalid credentials', 401));
    }

    const token = jwt.sign({ id: user.id }, 'secretkey', {
      expiresIn: '24h',
    });

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(new AppError('Server error', 500));
  }
};

//User Forgot Password
// export const forgotPassword = async (req:Request, res:Response, next:NextFunction) =>{
// const email = req.body;
// const checkUser = await prisma.user.findUnique({
//   where:{
//     email
//   }
// })
// //check user
// if(!checkUser){
//   return next(new AppError('user not found',404))
// }
// // return a code to the email

// }

//getSingleUserWithMoods
export const getSingleUserWithMoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {id} = req.params;

  try {
   
    const user = await prisma.user.findUnique({
      where: { id:Number(id) },
      include:{
        moods:true
      }
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'User fetch in successfully',
      user: user
    });
  } catch (error) {
    next(new AppError('Server error', 500));
  }
};


//check protected route
export const checkauth = (req: Request,
  res: Response,
  next: NextFunction) =>{
    res.send('yes this is protected route')
  }