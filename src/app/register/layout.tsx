import type { Metadata } from "next";

import { AuthLayout } from "@/components";

export const metadata: Metadata = {
  title: `Registration Page`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
