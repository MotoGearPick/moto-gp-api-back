-- carbon is a texture and multicolor a count, not colors: they broke "black + red" color filters.
-- Exposed carbon and solid-color ("Mono") variants become their own flags.

BEGIN;

ALTER TABLE "helmet_model_variant"
  ADD COLUMN "exposed_carbon" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "is_mono" BOOLEAN NOT NULL DEFAULT false;

-- Carbon weave reads as black when filtering by color.
UPDATE "helmet_model_variant"
SET "exposed_carbon" = true,
    "color_families" = CASE
      WHEN 'black' = ANY("color_families") THEN "color_families"
      ELSE array_append("color_families", 'black')
    END
WHERE 'carbon' = ANY("color_families");

-- graphic_name stays 'Mono' until each variant is reviewed and its real graphic restored.
UPDATE "helmet_model_variant" SET "is_mono" = true WHERE lower(trim("graphic_name")) = 'mono';

-- AlterEnum: Postgres can't drop enum values, so swap in a new type without them.
CREATE TYPE "color_family_new" AS ENUM ('black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'pink', 'purple', 'grey', 'silver', 'gold', 'brown', 'bronze', 'hi_vis', 'iridescent');
ALTER TABLE "helmet_model_variant" ALTER COLUMN "color_families" TYPE "color_family_new"[]
  USING (array_remove(array_remove("color_families", 'carbon'), 'multicolor')::text::"color_family_new"[]);
ALTER TYPE "color_family" RENAME TO "color_family_old";
ALTER TYPE "color_family_new" RENAME TO "color_family";
DROP TYPE "public"."color_family_old";
COMMIT;
