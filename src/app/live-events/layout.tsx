import type { Metadata } from "next";

export const metadata: Metadata = {

		title: `Published Events`,
		description: "Lists of the active and inactive event",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="bg-white w-full h-full"><>{children}</>

  </div>;
}
