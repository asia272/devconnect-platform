/*
  Warnings:

  - The values [QUESTION] on the enum `PostType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostType_new" AS ENUM ('PROJECT', 'POST');
ALTER TYPE "PostType" RENAME TO "PostType_old";
ALTER TYPE "PostType_new" RENAME TO "PostType";
DROP TYPE "public"."PostType_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubUrl" TEXT;
