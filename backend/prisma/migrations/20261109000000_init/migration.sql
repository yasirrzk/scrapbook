-- CreateEnum
CREATE TYPE "ReceiptCategory" AS ENUM ('food', 'transport', 'movie', 'shopping', 'travel', 'other');

-- CreateTable
CREATE TABLE "couples" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "couples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" UUID NOT NULL,
    "couple_id" UUID NOT NULL,
    "created_by" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "event_date" DATE NOT NULL,
    "category" "ReceiptCategory" NOT NULL DEFAULT 'other',
    "image_url" TEXT NOT NULL,
    "thumb_url" TEXT,
    "amount" DECIMAL(12,2),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scrapbooks" (
    "id" UUID NOT NULL,
    "couple_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "event_date" DATE NOT NULL,
    "bg_color" TEXT NOT NULL DEFAULT '#FFFDF5',
    "canvas_json" JSONB NOT NULL,
    "thumbnail_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scrapbooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "receipts_couple_id_idx" ON "receipts"("couple_id");

-- CreateIndex
CREATE INDEX "receipts_event_date_idx" ON "receipts"("event_date");

-- CreateIndex
CREATE INDEX "scrapbooks_couple_id_idx" ON "scrapbooks"("couple_id");

-- CreateIndex
CREATE INDEX "scrapbooks_event_date_idx" ON "scrapbooks"("event_date");

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scrapbooks" ADD CONSTRAINT "scrapbooks_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;
