import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import localFont from 'next/font/local'

const robotoCondensed = localFont({
  src: [
    {
      path: './fonts/roboto/Roboto_Condensed-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/roboto/Roboto_Condensed-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/roboto/Roboto_Condensed-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/roboto/Roboto_Condensed-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/roboto/Roboto_Condensed-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/roboto/Roboto_Condensed-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/roboto/Roboto_Condensed-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/roboto/Roboto_Condensed-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: './fonts/roboto/Roboto_Condensed-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/roboto/Roboto_Condensed-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-roboto-condensed',
  display: 'swap',
})
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
   
    <html lang="en"  className={robotoCondensed.className}>
      <body>{children}</body>
    </html>
  );
}