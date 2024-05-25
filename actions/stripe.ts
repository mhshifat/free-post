"use server";

import { stripe } from "@/lib/stripe";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function subscribeToPaid() {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0].emailAddress;
  let customerId = (user?.privateMetadata as any)?.customerId;
  
  if (customerId) {
    const billing = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    return redirect(billing.url);
  }
  if (!(user?.privateMetadata as any)?.customerId) {
    const customer = await stripe.customers.create({
      email: userEmail
    });
    await clerkClient.users.updateUserMetadata(user?.id!, {
      privateMetadata: {
        customerId: customer.id
      }
    });
    customerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    currency: "USD",
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?status=canceled`,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?status=subscribed`,
    metadata: {
      customerId,
      userId: user?.id || "",
    },
    mode: "subscription",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          unit_amount: 1000,
          product_data: {
            metadata: {
              customerId,
              userId: user?.id || "",
            },
            name: "Paid",
            description: "Paid Subscription",
            images: ["https://picsum.photos/200/300"],
          },
          recurring: {
            interval: "month",
          }
        }
      }
    ]
  });

  return redirect(session.url as string);
}