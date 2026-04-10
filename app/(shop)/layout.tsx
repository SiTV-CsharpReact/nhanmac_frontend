import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import { robotoCondensed } from "../fonts";
import Header from "@/components/share/Header";
import RightMenu from "@/components/share/RightMenu";
import Footer from "@/components/share/Footer";
import ScrollToTop from "@/components/share/ScrollToTop";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { env } from "@/config/env";

const SITE_URL = env.host;
const GA_ID = "G-5S447EXT78";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={robotoCondensed.variable}>
      <body className={`${robotoCondensed.className} font-root`}>

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>

        <StyledComponentsRegistry>
          <main>
            <Header />
            <RightMenu />
            {children}
            <ScrollToTop />
            <Footer />
          </main>
        </StyledComponentsRegistry>

      </body>
    </html>
  );
}