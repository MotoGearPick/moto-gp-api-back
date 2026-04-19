-- CreateEnum
CREATE TYPE "helmet_shape" AS ENUM ('full_face', 'modular', 'open_face', 'half', 'motocross');

-- CreateEnum
CREATE TYPE "helmet_purpose" AS ENUM ('street', 'off_road', 'snow', 'trials');

-- AlterTable
ALTER TABLE "helmet_model" ADD COLUMN     "helmet_purpose" "helmet_purpose"[] DEFAULT ARRAY[]::"helmet_purpose"[],
ADD COLUMN     "helmet_shape" "helmet_shape"[] DEFAULT ARRAY[]::"helmet_shape"[];

-- Backfill helmet_shape and helmet_purpose from helmet_type
UPDATE "helmet_model"
SET
  "helmet_shape" = ARRAY(
    SELECT DISTINCT CASE t
      WHEN 'full_face'::"helmet_type" THEN 'full_face'::"helmet_shape"
      WHEN 'modular'::"helmet_type"   THEN 'modular'::"helmet_shape"
      WHEN 'open_face'::"helmet_type" THEN 'open_face'::"helmet_shape"
      WHEN 'half'::"helmet_type"      THEN 'half'::"helmet_shape"
      WHEN 'off_road'::"helmet_type"  THEN 'motocross'::"helmet_shape"
    END
    FROM unnest("helmet_type") AS t
  ),
  "helmet_purpose" = ARRAY(
    SELECT DISTINCT CASE t
      WHEN 'off_road'::"helmet_type" THEN 'off_road'::"helmet_purpose"
      ELSE 'street'::"helmet_purpose"
    END
    FROM unnest("helmet_type") AS t
  )
WHERE array_length("helmet_type", 1) > 0;
