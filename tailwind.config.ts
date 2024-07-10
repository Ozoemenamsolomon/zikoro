import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      gradientColorStops: (theme) => ({
        "custom-gradient-start": "#001FCC",
        "custom-gradient-end": "#9D00FF",
        "custom-bg-gradient-start": "#001FCC19",
        "custom-bg-gradient-end": "#9D00FF19",
      }),
      linearGradientDirections: {
        // Define your custom gradient direction
        "top-right": "to top right",
      },
      linearGradientColors: (theme: (arg0: string) => any) => ({
        "custom-gradient": [
          theme("colors.custom-gradient-start"),
          theme("colors.custom-gradient-end"),
        ],
      }),
      colors: {
        zikoroBlue: "hsl(var(--zblue))",
        basePrimary: "#001FCC",
        basebody: "#f3f3f3",
        ticketColor: "#CFCFCF",
        greyBlack: "#0A0E2E",
        earlyBirdColor: "#001FCC",
        ash: "#717171",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    
      backgroundImage: {
        basePrimary: 'linear-gradient(to right, #001FCC 0%, #9D00FF 100%)'
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        tiny: "10px",
        mobile: "13px",
        desktop: "15px",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
       'float-in': {
          '0%': { transform: 'translateY(-10px)', opacity: '0',visibility: 'hidden' },
          '100%': { transform: 'translateY(0)', opacity: '1', visibility: 'visible' },
        },
        'float-out': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-10px)', opacity: '0', visibility: 'hidden' },
        },
      },
      animation: {
        'float-in': 'float-in 0.3s ease-out forwards',
        'float-out': 'float-out 0.3s ease-out forwards',
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'fade-in-out': 'fade-in-out 2s ease-in-out',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@vidstack/react/tailwind.cjs"),
  
  ],
} satisfies Config;

export default config;
