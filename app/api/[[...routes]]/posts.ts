import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { db } from "@/db/drizzle";
import { createId } from '@paralleldrive/cuid2';
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { insertPostSchema, posts } from "@/db/schema";

const postsApi = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    async (ctx) => {
      const auth = await getAuth(ctx);
      if (!auth?.userId) return ctx.json({ message: "unauthorized" }, 401);
      const data = await db
        .select({
          id: posts.id,
          title: posts.title,
          summary: posts.summary,
          thumbnail: posts.thumbnail,
          userId: posts.userId,
          type: posts.type,
        })
        .from(posts);
      return ctx.json({ data }, 200);
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertPostSchema.omit({ id: true, userId: true })),
    async (ctx) => {
      try {
        const auth = await getAuth(ctx);
        if (!auth?.userId) return ctx.json({ message: "unauthorized" }, 401);
        const body = ctx.req.valid("json");
        const payload = {
          id: createId(),
          userId: auth.userId,
          title: body.title,
          thumbnail: body.thumbnail,
          summary: body.summary,
          type: body.type,
        }
        const data = await db
          .insert(posts)
          .values(payload)
          .returning({ id: posts.id });
        return ctx.json({ data }, 201);
      } catch (err) {
        if (err instanceof Error) {
          console.log(err?.message);
          return ctx.json({ message: err?.message }, 500);
        }
        return ctx.json({ message: "Internal server error" }, 500);
      }
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({
      id: z.string()
    })),
    async (ctx) => {
      try {
        const auth = await getAuth(ctx);
        if (!auth?.userId) return ctx.json({ message: "unauthorized" }, 401);
        const { id } = ctx.req.valid("param");
        const data = await db
        .delete(posts)
        .where(
          and(
            eq(posts.userId, auth.userId),
            eq(posts.id, id)
          )
        )
        .returning({ id: posts.id });
        return ctx.json({ data }, 200);
      } catch (err) {
        if (err instanceof Error) {
          console.log(err?.message);
          return ctx.json({ message: err?.message }, 500);
        }
        return ctx.json({ message: "Internal server error" }, 500);
      }
    }
  );

export default postsApi;