-- CreateEnum
CREATE TYPE "Moods" AS ENUM ('HAPPY', 'SAD', 'ANGRY', 'EXCITED', 'CALM', 'ANXIOUS', 'NERVOUS', 'RELAXED', 'CONFIDENT', 'FRUSTRATED', 'BORED', 'HOPEFUL', 'GRATEFUL', 'LONELY', 'TIRED', 'ENERGETIC', 'CURIOUS', 'SCARED', 'LOVE', 'GUILTY', 'SHY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mood" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mood" "Moods" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Mood" ADD CONSTRAINT "Mood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
