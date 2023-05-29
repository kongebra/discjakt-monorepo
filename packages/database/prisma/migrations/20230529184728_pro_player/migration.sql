/*
  Warnings:

  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_bagId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Player";

-- CreateTable
CREATE TABLE "UserBags" (
    "bagId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserBags_pkey" PRIMARY KEY ("bagId","userId")
);

-- CreateTable
CREATE TABLE "ProPlayer" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "nationallity" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "pdgaNumber" TEXT NOT NULL,
    "bagId" INTEGER NOT NULL,

    CONSTRAINT "ProPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProPlayerSignatureDiscs" (
    "discId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "ProPlayerSignatureDiscs_pkey" PRIMARY KEY ("discId","playerId")
);

-- AddForeignKey
ALTER TABLE "UserBags" ADD CONSTRAINT "UserBags_bagId_fkey" FOREIGN KEY ("bagId") REFERENCES "Bag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBags" ADD CONSTRAINT "UserBags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProPlayer" ADD CONSTRAINT "ProPlayer_bagId_fkey" FOREIGN KEY ("bagId") REFERENCES "Bag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProPlayerSignatureDiscs" ADD CONSTRAINT "ProPlayerSignatureDiscs_discId_fkey" FOREIGN KEY ("discId") REFERENCES "Disc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProPlayerSignatureDiscs" ADD CONSTRAINT "ProPlayerSignatureDiscs_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "ProPlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
