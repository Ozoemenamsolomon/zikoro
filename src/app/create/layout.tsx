import type { Metadata } from "next";
import { AuthLayout } from "@/components";

export const metadata: Metadata = {
  title: `Create a new Event`,
  description: "Description",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout
      containerClassName="overflow-y-auto"
      className="mx-auto inset-x-0"
    >
      {children}
    </AuthLayout>
  );
}
