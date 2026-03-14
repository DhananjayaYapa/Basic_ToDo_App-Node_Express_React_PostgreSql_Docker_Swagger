/*
  Warnings:

  - You are about to drop the column `due_date` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `task` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "idx_task_user_due_date";

-- AlterTable
ALTER TABLE "task" DROP COLUMN "due_date",
DROP COLUMN "priority";

-- DropEnum
DROP TYPE "Priority";
