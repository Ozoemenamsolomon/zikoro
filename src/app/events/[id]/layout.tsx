import type { Metadata } from "next";
import { metaGenerator } from "./meta";

export const generateMetadata = async (): Promise<Metadata> =>
  await metaGenerator();

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="bg-white w-full h-full">{children}</div>;
}
