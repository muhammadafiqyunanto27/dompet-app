CREATE TABLE "transactions_sample" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"title" text NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users_sample" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_sample_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "transactions_sample" ADD CONSTRAINT "transactions_sample_user_id_users_sample_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_sample"("id") ON DELETE no action ON UPDATE no action;