import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={`${montserrat.className} `}> {children}</section>;
}
