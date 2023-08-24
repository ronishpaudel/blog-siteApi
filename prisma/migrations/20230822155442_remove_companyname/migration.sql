/*
  Warnings:

  - You are about to drop the column `companyName` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `dob` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `companyName`,
    MODIFY `dob` DATETIME NULL;
