import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import "../styles/globals.css";

const raleway = Raleway({
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Table d'Or",
  description:
    "Une expérience culinaire moderne : découvrez nos plats, réservez une table et commandez en ligne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${raleway.variable} h-full antialiased `}>
      <body className="min-h-full flex flex-col ">
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors closeButton className="!z-[9999]" />
      </body>
    </html>
  );
}