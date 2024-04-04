import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    weight: [ "200", "300", "400", "500", "600", "700", "800"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["Arial", "sans-serif"],
  });

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`${montserrat.className} `}>
        <Navbar/>
        {children}
        <Footer />
      </body>
    </html>
  );
}
