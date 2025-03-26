-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "address" VARCHAR(50),
    "fname" VARCHAR(40),
    "lname" VARCHAR(40),
    "dob" TIMESTAMP,
    "email" VARCHAR(80) NOT NULL,
    "username" VARCHAR(25) NOT NULL,
    "password" VARCHAR(180),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "currentOTP" INTEGER,
    "loginToken" VARCHAR(100),
    "googleAuthToken" VARCHAR(50),
    "phoneNumber" VARCHAR(18),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(130) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" VARCHAR(150),
    "thumbImageUrl" VARCHAR(150),
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completed" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "post_slug_key" ON "post"("slug");

-- CreateIndex
CREATE INDEX "post_userId_idx" ON "post"("userId");

-- CreateIndex
CREATE INDEX "post_categoryId_idx" ON "post"("categoryId");
