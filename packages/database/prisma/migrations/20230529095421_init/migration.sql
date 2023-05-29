-- CreateTable
CREATE TABLE "Disc" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brandId" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "glide" INTEGER NOT NULL,
    "turn" INTEGER NOT NULL,
    "fade" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscPlasticVariants" (
    "discId" INTEGER NOT NULL,
    "plasticId" INTEGER NOT NULL,

    CONSTRAINT "DiscPlasticVariants_pkey" PRIMARY KEY ("discId","plasticId")
);

-- CreateTable
CREATE TABLE "Plastic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brandId" INTEGER NOT NULL,

    CONSTRAINT "Plastic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscInBag" (
    "discId" INTEGER NOT NULL,
    "bagId" INTEGER NOT NULL,

    CONSTRAINT "DiscInBag_pkey" PRIMARY KEY ("discId","bagId")
);

-- CreateTable
CREATE TABLE "Bag" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Bag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "nationallity" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "pdgaNumber" TEXT NOT NULL,
    "bagId" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDiscs" (
    "discId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserDiscs_pkey" PRIMARY KEY ("discId","userId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Disc" ADD CONSTRAINT "Disc_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscPlasticVariants" ADD CONSTRAINT "DiscPlasticVariants_discId_fkey" FOREIGN KEY ("discId") REFERENCES "Disc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscPlasticVariants" ADD CONSTRAINT "DiscPlasticVariants_plasticId_fkey" FOREIGN KEY ("plasticId") REFERENCES "Plastic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plastic" ADD CONSTRAINT "Plastic_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscInBag" ADD CONSTRAINT "DiscInBag_discId_fkey" FOREIGN KEY ("discId") REFERENCES "Disc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscInBag" ADD CONSTRAINT "DiscInBag_bagId_fkey" FOREIGN KEY ("bagId") REFERENCES "Bag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_bagId_fkey" FOREIGN KEY ("bagId") REFERENCES "Bag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDiscs" ADD CONSTRAINT "UserDiscs_discId_fkey" FOREIGN KEY ("discId") REFERENCES "Disc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDiscs" ADD CONSTRAINT "UserDiscs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
