import type { Metadata } from "next";
import { /*Geist, Geist_Mono*/ Inter } from "next/font/google";
// import "./globals.css";
import "@/assets/styles/globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Lian Kala Shop Center",
  description: "Best E-commerce website on the planet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} antialiased `}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
