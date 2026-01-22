import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/share/Header";
import RightMenu from "@/components/share/RightMenu";
import Footer from "@/components/share/Footer";
import ScrollToTop from "@/components/share/ScrollToTop";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { env } from "@/config/env";

const SITE_URL = env.host;
export const metadata: Metadata = {
  title: "Công ty Cổ phần Công Nghệ Thiên Lương",
  description: "Nhãn mác – tem nhãn – nameplate",

  icons: {
    icon: `${SITE_URL}favicon.ico`,
    apple: `${SITE_URL}favicon.ico`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
      <main >
        <Header />
        <RightMenu/>
       {children}
        <ScrollToTop />
        <Footer/>
        {/* {children} */}
      </main>
  
  );
}
