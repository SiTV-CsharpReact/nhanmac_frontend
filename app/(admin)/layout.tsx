import type { Metadata } from "next";
import "antd/dist/reset.css"; // Nếu dùng Ant Design v5+
import "../globals.css";
import ScrollToTop from "@/components/share/ScrollToTop";
import HeaderAdmin from "@/components/share/HeaderAdmin";
import Navbar from "@/components/share/Navbar";
import StyledComponentsRegistry from "@/lib/AntdRegistry";

export const metadata: Metadata = {
  title: "Trang quản trị Admin",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" type="image/png" sizes="32x32" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </head>
      <body>
        <div className="bg-[#d7d7d780] h-full container-admin">
          <HeaderAdmin />

          <div className="flex">
            <Navbar />
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          </div>
          <ScrollToTop />
        </div>
      </body>
    </html>
  );
}
