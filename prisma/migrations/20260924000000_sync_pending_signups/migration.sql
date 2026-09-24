-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'PENDING';

-- CreateTable
CREATE TABLE "pending_signups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastOtpSentAt" TIMESTAMP(3),

    CONSTRAINT "pending_signups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pending_signups_email_key" ON "pending_signups"("email");

-- CreateIndex
CREATE INDEX "pending_signups_expiresAt_idx" ON "pending_signups"("expiresAt");

