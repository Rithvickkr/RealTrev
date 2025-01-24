/*
  Warnings:

  - The values [RESPONDED,CLOSED] on the enum `QueryStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QueryStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'RESOLVED');
ALTER TABLE "Query" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Query" ALTER COLUMN "status" TYPE "QueryStatus_new" USING ("status"::text::"QueryStatus_new");
ALTER TYPE "QueryStatus" RENAME TO "QueryStatus_old";
ALTER TYPE "QueryStatus_new" RENAME TO "QueryStatus";
DROP TYPE "QueryStatus_old";
ALTER TABLE "Query" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
