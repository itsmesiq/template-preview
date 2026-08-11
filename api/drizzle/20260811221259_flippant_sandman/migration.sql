ALTER TABLE "components" ADD COLUMN "available_in_all_pages" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "components" ADD COLUMN "available_in_all_emails" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "components" ADD COLUMN "params" jsonb DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DEFAULT now();