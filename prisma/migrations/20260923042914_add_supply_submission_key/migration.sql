/*
  Warnings:

  - A unique constraint covering the columns `[submissionKey]` on the table `supply_requests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `submissionKey` to the `supply_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "supply_requests" ADD COLUMN     "submissionKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "supply_requests_submissionKey_key" ON "supply_requests"("submissionKey");
