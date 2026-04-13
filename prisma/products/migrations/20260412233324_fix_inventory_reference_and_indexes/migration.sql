/*
  Warnings:

  - A unique constraint covering the columns `[variant_id,size_id,store_id]` on the table `helmet_inventory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[model_id,size_label]` on the table `helmet_model_size` will be added. If there are existing duplicate values, this will fail.
  - Made the column `variant_id` on table `helmet_inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "helmet_inventory_size_id_store_id_key";

-- AlterTable
ALTER TABLE "helmet_inventory" ALTER COLUMN "variant_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "helmet_inventory_variant_id_idx" ON "helmet_inventory"("variant_id");

-- CreateIndex
CREATE INDEX "helmet_inventory_variant_id_in_stock_idx" ON "helmet_inventory"("variant_id", "in_stock");

-- CreateIndex
CREATE INDEX "helmet_inventory_in_stock_price_idx" ON "helmet_inventory"("in_stock", "price");

-- CreateIndex
CREATE UNIQUE INDEX "helmet_inventory_variant_id_size_id_store_id_key" ON "helmet_inventory"("variant_id", "size_id", "store_id");

-- CreateIndex
CREATE INDEX "helmet_model_deleted_at_brand_id_idx" ON "helmet_model"("deleted_at", "brand_id");

-- CreateIndex
CREATE INDEX "helmet_model_size_model_id_idx" ON "helmet_model_size"("model_id");

-- CreateIndex
CREATE UNIQUE INDEX "helmet_model_size_model_id_size_label_key" ON "helmet_model_size"("model_id", "size_label");

-- CreateIndex
CREATE INDEX "helmet_model_variant_deleted_at_idx" ON "helmet_model_variant"("deleted_at");

-- CreateIndex
CREATE INDEX "helmet_model_variant_helmet_id_deleted_at_idx" ON "helmet_model_variant"("helmet_id", "deleted_at");
