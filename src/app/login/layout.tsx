import type { Metadata } from "next";

import { AuthLayout } from "@/components";

export const metadata: Metadata = {
  title: `Login Page`,
  description: "Description",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
