/*
  Warnings:

  - Added the required column `brand_slug` to the `bedrock_batch_job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `bedrock_batch_job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bedrock_batch_item" ADD COLUMN     "cleaned_html" TEXT,
ADD COLUMN     "image_urls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "source_url" TEXT;

-- AlterTable
ALTER TABLE "bedrock_batch_job" ADD COLUMN     "brand_slug" VARCHAR(100) NOT NULL,
ADD COLUMN     "source" VARCHAR(100) NOT NULL;
