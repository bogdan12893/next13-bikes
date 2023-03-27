"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

interface Props {
  children?: ReactNode;
}

const QueryWrapper = ({ children }: Props) => (
  <SessionProvider>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      {children}
    </QueryClientProvider>
  </SessionProvider>
);

export default QueryWrapper;
