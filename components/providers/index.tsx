import { PropsWithChildren } from "react";
import QueryProvider from "./query-provider";
import { Toaster } from "../ui/sonner";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <Toaster />
      {children}
    </QueryProvider>
  )
}