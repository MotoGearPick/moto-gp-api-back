-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('superadmin', 'variant_reviewer');

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'superadmin';
