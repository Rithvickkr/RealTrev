/*
  Warnings:

  - You are about to drop the `locationupdates` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- DropForeignKey
ALTER TABLE "locationupdates" DROP CONSTRAINT "locationupdates_guideid_fkey";

-- DropForeignKey
ALTER TABLE "locationupdates" DROP CONSTRAINT "locationupdates_locationId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Query" ADD COLUMN     "severity" "Severity";

-- DropTable
DROP TABLE "locationupdates";

-- CreateTable
CREATE TABLE "Updates" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "coordinates" JSONB NOT NULL,
    "severity" "Severity",
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Updates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Updates_severity_idx" ON "Updates"("severity");

-- CreateIndex
CREATE INDEX "Updates_timestamp_idx" ON "Updates"("timestamp");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Updates" ADD CONSTRAINT "Updates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
