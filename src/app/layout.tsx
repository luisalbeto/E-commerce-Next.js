import type { Metadata } from "next";
import { inter } from "@/config/fonts";

import "./globals.css";


export const metadata: Metadata = {
  title:{
    template: '%s - Teslo | Shop',
    default: 'Home - Teslo | Shop'
  },
  description: "Virtual products store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
