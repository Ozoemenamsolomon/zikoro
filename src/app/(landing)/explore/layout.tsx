import { montserrat } from "@/utils/fonts";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={`${montserrat.className} `}> {children}</section>;
}
