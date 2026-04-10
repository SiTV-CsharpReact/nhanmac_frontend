import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { robotoCondensed } from "./fonts";


export const metadata: Metadata = {
  title: "Trang đăng nhập",
  description: "Giao diện đăng nhập nhãn mác",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html lang="en" className={robotoCondensed.variable}>
      <body className={robotoCondensed.className}>
        {children}
      </body>
    </html>
  );
}