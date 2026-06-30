import Header from "@/components/shared/header";
import Footer from "@/components/footer";
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*<html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}}`>*/
        <div className="flex h-screen flex-col">
          <Header />
          <main className="flex-1 wrapper">{children}</main>
          <Footer />
        </div>
      /*</body>
    </html>*/
  );
}
