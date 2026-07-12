-- CreateEnum
CREATE TYPE "RiskTrafficLight" AS ENUM ('VERDE', 'AMARILLO', 'ROJO');

-- AlterTable
ALTER TABLE "financial_entities" ADD COLUMN     "fsdCoverageAmount" DOUBLE PRECISION,
ADD COLUMN     "fsdCoverageCurrency" "Currency" NOT NULL DEFAULT 'PEN',
ADD COLUMN     "fsdIsActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "riskTrafficLight" "RiskTrafficLight" NOT NULL DEFAULT 'VERDE',
ADD COLUMN     "sbsClassification" TEXT;
