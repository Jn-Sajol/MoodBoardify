import express, { Express} from 'express';
import { PrismaClient } from '@prisma/client';
import userRouter from './v1/routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';
import moodRouter from './v1/routes/moodRoutes';

const app: Express = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json());



//routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/mood', moodRouter)

//Error Handler
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

