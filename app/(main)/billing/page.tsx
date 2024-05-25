import { subscribeToPaid } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";

export default async function BillingPage({ searchParams }: { searchParams: { status: string } }) {
  const user = await currentUser();

  if (searchParams.status) return <p><strong>Billing Status: </strong> {searchParams.status}</p>
  return (
    <div>
      <form action={subscribeToPaid}>
        <Button variant={user?.privateMetadata?.subscribeTo === "paid" ? "destructive" : "default"} type="submit">
          {user?.privateMetadata?.subscribeTo === "paid" ? "Cancel Subscription" : "Subscribe To Paid"}
        </Button>
      </form>
    </div>
  )
}