/*
  Warnings:

  - You are about to alter the column `dob` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Made the column `isVerified` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `loginToken` VARCHAR(300) NULL,
    MODIFY `dob` DATETIME NULL,
    MODIFY `isVerified` BOOLEAN NOT NULL DEFAULT false;
