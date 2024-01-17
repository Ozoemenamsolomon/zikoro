import type { Metadata } from "next";
import { metaGenerator } from "./meta";
import { AuthLayout } from "@/components";

export const generateMetadata = async (): Promise<Metadata> =>
  await metaGenerator();

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
