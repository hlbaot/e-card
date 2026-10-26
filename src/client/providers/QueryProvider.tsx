"use client";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { bindQuerySession, createQueryClient } from "@/client/queries/client";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(createQueryClient);
  useEffect(() => bindQuerySession(client), [client]);
  return <QueryClientProvider client={client}>
    {children}
    {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>;
}
