import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "../styles/globals.css";

const raleway = Raleway({
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stock Management App",
  description:
    "A Saas application for managing stock and inventory efficiently.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${raleway.variable} h-full antialiased `}>
      <body className="min-h-full flex flex-col ">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}