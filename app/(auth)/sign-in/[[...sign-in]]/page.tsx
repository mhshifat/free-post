import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  return (
    <>
      <ClerkLoaded>
        <SignIn />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="animate-spin text-slate-500 size-4" />
      </ClerkLoading>
    </>
  );
}