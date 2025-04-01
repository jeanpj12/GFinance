/*
  Warnings:

  - Added the required column `category_id` to the `sub_categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sub_categories" ADD COLUMN     "category_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
