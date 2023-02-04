-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'BUSINESS', 'ADMIN');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE_TOTAL', 'FIXED_TOTAL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(256) NOT NULL,
    "lastName" VARCHAR(256) NOT NULL,
    "address" TEXT NOT NULL,
    "phone" VARCHAR(16) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "username" VARCHAR(256) NOT NULL,
    "password" VARCHAR(256) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(256) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(256) NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAttribute" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,

    CONSTRAINT "ProductAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "symbol" VARCHAR(256) NOT NULL,
    "acronym" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(256) NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "limit" INTEGER,
    "remaining" INTEGER,
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AttributeToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_name_key" ON "Attribute"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_productId_key" ON "Cart"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_code_key" ON "Discount"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_AttributeToCategory_AB_unique" ON "_AttributeToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_AttributeToCategory_B_index" ON "_AttributeToCategory"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttribute" ADD CONSTRAINT "ProductAttribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttribute" ADD CONSTRAINT "ProductAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeToCategory" ADD CONSTRAINT "_AttributeToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeToCategory" ADD CONSTRAINT "_AttributeToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
