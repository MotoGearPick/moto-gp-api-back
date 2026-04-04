/*
  Warnings:

  - The values [snell,fim] on the enum `helmet_certification` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "helmet_certification_new" AS ENUM ('dot', 'ece_2205', 'ece_2206', 'snell_m2020', 'snell_m2025', 'fim_frhphe_01', 'fim_frhphe_02');
ALTER TABLE "helmet_model" ALTER COLUMN "certification" TYPE "helmet_certification_new"[] USING ("certification"::text::"helmet_certification_new"[]);
ALTER TYPE "helmet_certification" RENAME TO "helmet_certification_old";
ALTER TYPE "helmet_certification_new" RENAME TO "helmet_certification";
DROP TYPE "public"."helmet_certification_old";
COMMIT;
