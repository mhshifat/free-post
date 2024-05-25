import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  summary: text("summary").notNull(),
  type: text("type").notNull(),
  userId: text("user_id").notNull(),
});

export const insertPostSchema = createInsertSchema(posts);

export const stripeCustomers = pgTable("stripe_customers", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull(),
  userId: text("user_id").notNull(),
});

