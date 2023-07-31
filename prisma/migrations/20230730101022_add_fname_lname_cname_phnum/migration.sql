/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `dob` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `companyName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fname` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lname` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `name`,
    ADD COLUMN `companyName` VARCHAR(80) NOT NULL,
    ADD COLUMN `fname` VARCHAR(200) NOT NULL,
    ADD COLUMN `lname` VARCHAR(200) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL DEFAULT '000-000-0000',
    MODIFY `dob` DATETIME NULL,
    MODIFY `password` VARCHAR(50) NOT NULL,
    MODIFY `username` VARCHAR(50) NULL;
