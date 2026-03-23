-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'RUNNING', 'FULFILLED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'DRAFT';
