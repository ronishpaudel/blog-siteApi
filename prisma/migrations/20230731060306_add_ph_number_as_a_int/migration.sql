/*
  Warnings:

  - You are about to alter the column `dob` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `phoneNumber` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `dob` DATETIME NULL,
    MODIFY `phoneNumber` INTEGER NOT NULL;
