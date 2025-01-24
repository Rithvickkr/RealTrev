-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TRAVELLER', 'LOCAL');

-- Step 1: Modify the `User` table for role change

-- Add new `newRole` column to migrate data from `role`
ALTER TABLE "User" ADD COLUMN "newRole" "Role";

-- Migrate data from old `role` to `newRole` with type casting
-- We're assuming the old role was stored as text
UPDATE "User"
SET "newRole" = CAST("role" AS "Role");

-- Drop the old `role` column
ALTER TABLE "User" DROP COLUMN "role";

-- Rename `newRole` to `role`
ALTER TABLE "User" RENAME COLUMN "newRole" TO "role";

-- Step 2: Modify the `Message` table for location addition

-- Add the `location` column with a default value for existing rows
ALTER TABLE "Message" ADD COLUMN "location" TEXT NOT NULL DEFAULT 'Unknown';

-- Remove the default now that existing rows are populated
ALTER TABLE "Message" ALTER COLUMN "location" DROP DEFAULT;
