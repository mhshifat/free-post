CREATE TABLE IF NOT EXISTS "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"thumbnail" text NOT NULL,
	"summary" text NOT NULL,
	"type" text NOT NULL,
	"user_id" text NOT NULL
);
