ALTER TABLE "transactions_sample" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "transactions_sample" ALTER COLUMN "created_at" SET NOT NULL;