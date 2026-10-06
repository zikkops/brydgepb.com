import type { Metadata } from "next";
import { DM_Sans, Montserrat } from "next/font/google";
import "./globals.css";

// Montserrat Black is the closest free match to the heavy geometric BRYDGE
// wordmark; DM Sans for body copy. Swap if the brand has an official typeface.
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["600", "700", "800", "900"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Brydge — Built for you", template: "%s · Brydge" },
  description: "Protein bars built for real days. Four flavours: Almond, Strawberry, Dark Chocolate and Coconut Matcha. Cash on delivery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
