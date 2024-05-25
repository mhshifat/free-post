CREATE TABLE IF NOT EXISTS "stripe_customers" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"user_id" text NOT NULL
);
