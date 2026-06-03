-- CreateEnum
CREATE TYPE "review_check_status" AS ENUM ('pending', 'reviewed');

-- AlterTable
ALTER TABLE "scrape_review" ADD COLUMN     "model_review_status" "review_check_status" NOT NULL DEFAULT 'pending',
ADD COLUMN     "model_reviewed_at" TIMESTAMPTZ(6),
ADD COLUMN     "model_reviewed_by" UUID,
ADD COLUMN     "variant_review_status" "review_check_status" NOT NULL DEFAULT 'pending',
ADD COLUMN     "variant_reviewed_at" TIMESTAMPTZ(6),
ADD COLUMN     "variant_reviewed_by" UUID;

-- CreateIndex
CREATE INDEX "scrape_review_variant_review_status_idx" ON "scrape_review"("variant_review_status");

-- CreateIndex
CREATE INDEX "scrape_review_model_review_status_idx" ON "scrape_review"("model_review_status");
