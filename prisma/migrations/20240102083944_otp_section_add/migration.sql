/*
  Warnings:

  - You are about to alter the column `dob` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `currentOTP` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `currentOTP` INTEGER NOT NULL,
    MODIFY `dob` DATETIME NULL;
