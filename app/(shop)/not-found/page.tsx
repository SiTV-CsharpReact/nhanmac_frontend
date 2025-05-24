import Image from "next/image";
import { Button } from "antd";
// import { redirect } from "next/navigation";
import Header from "@/components/share/Header";
import Footer from "@/components/share/Footer";
// import "./globals.css";
import Link from "next/link";
export const metadata = {
  title: "Nhanmac.vn | 404 - Không tìm thấy trang",
  description:
    "Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.",
  robots: "noindex, nofollow",
};
export default function NotFound() {
  return (
    <>
 
      <div className="flex justify-center items-center px-4">
        <div className="container max-w-7xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-12">
            {/* Right image */}
            <div className="col-span-1 md:col-span-6 flex justify-center md:justify-end order-1 md:order-2">
              <Image
                src="/images/NotFound.png"
                width={572}
                height={475}
                alt="not found"
                className="w-full max-w-md md:max-w-none h-auto"
                priority
              />
            </div>

            {/* Left content */}
            <div className="col-span-1 md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
              <Image
                src="/images/logo.png"
                width={80}
                height={70}
                alt="not found"
                className="mb-6 hidden md:flex"
              />
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <span className="text-[#EB5757] text-4xl md:text-[48px] font-bold">
                  404
                </span>
                <span className="text-lg md:text-2xl text-[#4F4F4F] font-semibold">
                  KHÔNG TÌM THẤY TRANG
                </span>
              </div>

              <div className="mt-8 flex md:flex-col sm:flex-row justify-center md:justify-start gap-4 w-full max-w-xs mx-auto md:mx-0">
                <Link href="/">
                  <Button
                    style={{
                      background: "#7367F0",
                      fontSize: 17,
                      fontWeight: 500,
                      height: 48,
                      width: "100%",
                      maxWidth: 135,
                      borderRadius: 8,
                      color: "white",
                    }}
                  >
                    Trang chủ
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    style={{
                      background: "#fff",
                      border: "1px solid #7367F0",
                      fontSize: 17,
                      fontWeight: 500,
                      height: 48,
                      width: "100%",
                      maxWidth: 135,
                      borderRadius: 8,
                      color: "#7367F0",
                    }}
                  >
                    Liên hệ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
   
    </>
  );
}
