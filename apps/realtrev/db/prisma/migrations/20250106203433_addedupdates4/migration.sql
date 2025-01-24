/*
  Warnings:

  - Added the required column `title` to the `Updates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Updates" ADD COLUMN     "title" TEXT NOT NULL;
