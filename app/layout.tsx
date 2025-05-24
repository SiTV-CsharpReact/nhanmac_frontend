import "./globals.css";
import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Trang đăng nhập",
  description: "Giao diện đăng nhập nhãn mác",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("React version:", React.version);
  return (
   
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}