/*
  Warnings:

  - The values [iridiscent] on the enum `color_family` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "color_family_new" AS ENUM ('black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'pink', 'purple', 'grey', 'silver', 'gold', 'brown', 'carbon', 'multicolor', 'bronze', 'hi_vis', 'iridescent');
ALTER TABLE "helmet_model_variant" ALTER COLUMN "color_families" TYPE "color_family_new"[] USING ("color_families"::text::"color_family_new"[]);
ALTER TYPE "color_family" RENAME TO "color_family_old";
ALTER TYPE "color_family_new" RENAME TO "color_family";
DROP TYPE "public"."color_family_old";
COMMIT;
