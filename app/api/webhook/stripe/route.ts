import { stripe } from "@/lib/stripe";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { addDays } from 'date-fns';
import { db } from "@/db/drizzle";
import { createId } from '@paralleldrive/cuid2';
import { stripeCustomers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature as string,
      process.env.WEBHOOK_STRIPE_SECRET!
    );
  } catch (err) {
    return new NextResponse("Webhook err", { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const userId = event.data.object?.metadata?.userId;
      await clerkClient.users.updateUserMetadata(userId!, {
        privateMetadata: {
          subscribeTo: "paid",
          subscriptionEnd: addDays(new Date(), 30).toISOString(),
        }
      });
      await db
        .insert(stripeCustomers)
        .values({
          // @ts-ignore
          id: createId(),
          customerId: event.data.object?.metadata?.customerId,
          userId: userId,
        })
        .returning({ id: stripeCustomers.id });
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as any;
      const customerId = subscription?.customer;
      const [stripeCustomer] = await db
        .select({ userId: stripeCustomers.userId })
        .from(stripeCustomers)
        .where(
          eq(stripeCustomers.customerId, customerId)
        );
      const previousSubscription = event.data.previous_attributes as any;

      if (subscription.cancel_at_period_end === true) {
        await clerkClient.users.updateUserMetadata(stripeCustomer.userId!, {
          privateMetadata: {
            subscribeTo: "free",
            subscriptionEnd: null,
          }
        });
      } else {
        await clerkClient.users.updateUserMetadata(stripeCustomer.userId!, {
          privateMetadata: {
            subscribeTo: "paid",
            subscriptionEnd: addDays(new Date(), 30).toISOString(),
          }
        });
      }
    }
    default: {}
  }

  return new NextResponse(null, { status: 200 });
}