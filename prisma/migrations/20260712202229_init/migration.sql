-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('ESTUDIANTE', 'PROFESIONAL');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('BANCO', 'CAJA_MUNICIPAL', 'FINANCIERA');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('AHORRO', 'PLAZO_FIJO');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('PEN', 'USD');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'ESTUDIANTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_entities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "type" "EntityType" NOT NULL,

    CONSTRAINT "financial_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_rates" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "rateValue" DOUBLE PRECISION NOT NULL,
    "productType" "ProductType" NOT NULL,
    "currency" "Currency" NOT NULL,
    "minTerm" INTEGER NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "financial_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "termDays" INTEGER NOT NULL,
    "appliedRate" DOUBLE PRECISION NOT NULL,
    "earnedInterest" DOUBLE PRECISION NOT NULL,
    "selectedEntityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "glossary_terms" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "simpleDefinition" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "glossary_terms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "glossary_terms_term_key" ON "glossary_terms"("term");

-- AddForeignKey
ALTER TABLE "financial_rates" ADD CONSTRAINT "financial_rates_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "financial_entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_selectedEntityId_fkey" FOREIGN KEY ("selectedEntityId") REFERENCES "financial_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
