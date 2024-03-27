import Navbar2 from "@/components/Navbar2";
import BlogHeader from "@/components/blog/BlogHeader";
import Footer from "@/components/Footer";
import BlogNav from "@/components/blog/BlogNav";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    weight: [ "200", "300", "400", "500", "600", "700", "800"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["Arial", "sans-serif"],
  });

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`${montserrat.className} `}>
        <Navbar2 />
        <BlogHeader />
        <BlogNav/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
