import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Create a new Event`,
  description: "Description",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
