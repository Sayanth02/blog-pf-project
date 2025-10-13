import type { Metadata } from "next";
import {  Lato , Questrial, Source_Code_Pro} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";




const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin"],
  weight: "400",
});

// const sourceCodePro = Source_Code_Pro({
//   variable: "--font-source-code-pro",
//   subsets: ["latin"],
//   weight: ["400"],
// }) ;

const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700"],
  subsets: ["latin"],
})



export const metadata: Metadata = {
  title: "Blog - Portfolio Project",
  description: "A modern blog platform built with Next.js, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${questrial.variable} ${lato.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
        <Toaster theme="dark" richColors />
      </body>
    </html>
  );
}
