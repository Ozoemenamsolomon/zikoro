
import { metaGenerator } from "../../../meta";
import { Metadata } from "next";

export const generateMetadata = async ({ params }: { params: { eventId: string } }): Promise<Metadata> =>
	await metaGenerator({ params });

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
