import {
  Inter,
  Heebo,
  Dancing_Script,
  Lato,
  Roboto,
  Montserrat,
} from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
export const heebo = Heebo({ subsets: ["latin"] });
export const dancingScript = Dancing_Script({ subsets: ["latin"] });
export const montserrat = Montserrat({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const lato = Lato({
  subsets: ["latin"],
  weight: ["700"],
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["700"],
});
