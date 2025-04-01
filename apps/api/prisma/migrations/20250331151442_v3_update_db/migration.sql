-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_sub_category_id_fkey";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "sub_category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "sub_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
