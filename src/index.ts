import express, { Express, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
import userRouter from './v1/routes/userRoutes';

const app: Express = express();
// const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json());

//routes

app.use('/api/v1/user', userRouter)


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

