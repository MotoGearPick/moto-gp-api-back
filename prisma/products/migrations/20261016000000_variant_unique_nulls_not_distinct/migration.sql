-- Hand-written: Prisma can't express NULLS NOT DISTINCT, so the schema's @@unique stays as is.
-- The old index let duplicate (helmet, color) variants through whenever graphic_name was NULL.

-- 1. Pick one survivor per duplicate group: live over soft-deleted, then with images, then oldest.
CREATE TEMP TABLE "variant_dupes" AS
SELECT "id", first_value("id") OVER (
  PARTITION BY "helmet_id", "color_name"
  ORDER BY ("deleted_at" IS NOT NULL), (cardinality("image_url") = 0), "created_at", "id"
) AS "keep_id"
FROM "helmet_model_variant"
WHERE "graphic_name" IS NULL;

DELETE FROM "variant_dupes" WHERE "id" = "keep_id";

-- 2. Move the duplicates' inventory to the survivor, dropping rows that would collide on (variant, size, store).
DELETE FROM "helmet_inventory" i
USING "variant_dupes" d
WHERE i."variant_id" = d."id"
  AND (
    EXISTS (
      SELECT 1 FROM "helmet_inventory" k
      WHERE k."variant_id" = d."keep_id" AND k."size_id" = i."size_id" AND k."store_id" = i."store_id"
    )
    OR i."id" NOT IN (
      SELECT DISTINCT ON (d2."keep_id", i2."size_id", i2."store_id") i2."id"
      FROM "helmet_inventory" i2
      JOIN "variant_dupes" d2 ON d2."id" = i2."variant_id"
      ORDER BY d2."keep_id", i2."size_id", i2."store_id", i2."updated_at" DESC
    )
  );

UPDATE "helmet_inventory" i
SET "variant_id" = d."keep_id"
FROM "variant_dupes" d
WHERE i."variant_id" = d."id";

-- 3. Remove the duplicates.
DELETE FROM "helmet_model_variant" v
USING "variant_dupes" d
WHERE v."id" = d."id";

DROP TABLE "variant_dupes";

-- 4. Same index name and columns, now treating NULL graphic_name as equal.
DROP INDEX "helmet_variant_helmet_id_color_name_key";
CREATE UNIQUE INDEX "helmet_variant_helmet_id_color_name_key"
  ON "helmet_model_variant"("helmet_id", "color_name", "graphic_name") NULLS NOT DISTINCT;
