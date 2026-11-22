import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: { default: "FixMate — Verified Device & Appliance Repair", template: "%s · FixMate" },
  description:
    "Book verified technicians for smartphones, laptops, ACs, refrigerators, TVs, washing machines and electrical work. Track every job and pay only after it is fixed.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${manrope.variable}`} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
