"use client";

import { useOfflinePrompt } from "@/hooks/common";

export const NetworkWrapper = ({ children }: { children: React.ReactNode }) => {
  // regular check to see when user is offline
  useOfflinePrompt();

  return children;
};
