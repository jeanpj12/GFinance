/*
  Warnings:

  - A unique constraint covering the columns `[transaction_id]` on the table `emergency_fund` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transaction_id` to the `emergency_fund` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "emergency_fund" ADD COLUMN     "transaction_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "emergency_fund_transaction_id_key" ON "emergency_fund"("transaction_id");

-- AddForeignKey
ALTER TABLE "emergency_fund" ADD CONSTRAINT "emergency_fund_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
