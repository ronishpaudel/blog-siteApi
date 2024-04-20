-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(50) NULL,
    `fname` VARCHAR(40) NULL,
    `lname` VARCHAR(40) NULL,
    `dob` DATETIME NULL,
    `email` VARCHAR(80) NOT NULL,
    `username` VARCHAR(25) NOT NULL,
    `password` VARCHAR(180) NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `currentOTP` INTEGER NULL,
    `loginToken` VARCHAR(100) NULL,
    `googleAuthToken` VARCHAR(50) NULL,
    `phoneNumber` VARCHAR(18) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(120) NOT NULL,
    `slug` VARCHAR(130) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `imageUrl` VARCHAR(150) NULL,
    `thumbImageUrl` VARCHAR(150) NULL,
    `isDraft` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NULL,
    `categoryId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `completed` TINYINT NOT NULL DEFAULT 0,

    UNIQUE INDEX `post_slug_key`(`slug`),
    INDEX `post_userId_idx`(`userId`),
    INDEX `post_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
