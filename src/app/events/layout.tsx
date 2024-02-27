import type { Metadata } from "next";

export const metadata: Metadata = {

		title: `Events`,
		description: "Lists of Organization Events",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="bg-white w-full h-full"><>{children}</>

  </div>;
}
