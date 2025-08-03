// components/Footer.js

import Image from "next/image";
import FacebookPagePlugin from "../plugin/FaceBookPlugin";
import FacebookSDK from "./FacebookSDK";
import FacebookPage from "./FacebookPage";
import Link from "next/link";
// import dynamic from "next/dynamic";

// Dynamic import FacebookGroup, chỉ render trên client
// const FacebookGroup = dynamic(() => import("./FacebookGroup"), { ssr: false });

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-14 mx-auto pt-8 container">
        {/* Cột 1: Logo và thông tin công ty */}
        <div className="space-y-3 md:col-span-2">
          <Image
            src="/images/logo.png"
            alt="Thiên Lương"
            width={100}
            height={50}
            className="mb-3"
          />
          <h3 className="font-bold uppercase text-xl">
            CÔNG TY CỔ PHẦN CÔNG NGHỆ THIÊN LƯƠNG
          </h3>
          <p className="flex items-start">
            <Image
              src="/icons/map-2.svg"
              alt="Địa chỉ"
              width={36}
              height={36}
              className="mr-2.5"
            />
            <span>
              Số 41, Phương Liệt, Phường Phương Liệt, Quận Thanh Xuân, TP Hà Nội
            </span>
          </p>

          {/* Hotline */}
          <div className="flex items-center">
            <Image
              src="/icons/phone-call-white.svg"
              alt="Hotline"
              width={36}
              height={36}
              className="mr-2"
            />
            <div>
              <p className="font-bold">Hotline:</p>
              <a href="tel:0912424368" className="text-[#2F80ED]">
                0912.424.368
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center">
            <Image
              src="/icons/brand-gmail-full.svg"
              alt="Email"
              width={36}
              height={36}
              className="mr-2"
            />
            <div>
              <p className="font-bold">Email:</p>
              <a
                href="mailto:nhanmac.vn@gmail.com"
                className="hover:text-blue-300"
              >
                nhanmac.vn@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Cột 2: Menu và Facebook Group */}
        <div className="md:col-span-3 pt-6">
          {/* Menu */}
          <div className="flex flex-wrap justify-between text-white text-sm mb-6">
          <Link href="/">
            <h3 className="text-lg font-medium pb-2 cursor-pointer hover:text-blue-400">
              Trang chủ
            </h3>
            </Link>
            <Link href="/tem-nhan-mac-cong-ty-thien-luong-307.html">
            <h3 className="text-lg font-medium pb-2 cursor-pointer hover:text-blue-400">
              Giới thiệu
            </h3>
            </Link>
            <Link href="/tin-tong-hop">
            <h3 className="text-lg font-medium pb-2 cursor-pointer hover:text-blue-400">
              Tin tức
            </h3>
            </Link>
            <Link href="/contact">
            <h3 className="text-lg font-medium pb-2 cursor-pointer hover:text-blue-400">
              Liên hệ
            </h3>
            </Link>
          </div>

          {/* Zalo và Facebook Group */}
        <div className="flex flex-col md:flex-row gap-5">
            {/* Zalo */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 w-full gap-6 rounded-[10px] md:w-1/2 h-[125px]"
              style={{
                background:
                  "linear-gradient(90deg, #D9D9D9 0%, #84ADE8 45.67%, #0068FF 100%)",
              }}
            >
              <div className="flex gap-5">
                <Image
                  src="/images/qr-zalo-footer.png"
                  alt="Zalo QR Code"
                  width={110}
                  height={110}
                  className="rounded-xl p-0.5  bg-white object-contain m-2"
                  style={{ objectFit: "contain" }}
                />
                <div className="flex flex-col mt-4">
                  {" "}
                  {/* đẩy xuống 1 chút */}
                  <p className="text-[#05224A] text-lg font-bold mb-1 whitespace-nowrap">
                    Hỗ trợ khách hàng 24/7
                  </p>
                  <span className="text-[#EB5757] font-semibold">
                    Ms.Lan Anh
                  </span>
                  <span className="text-[#EB5757] font-semibold">
                    0912.424.368
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-center md:w-1/2  w-full">
            <iframe
            //  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fweb.facebook.com%2Fnhanmac.vn&tabs=timeline&width=500&height=300&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=254328106490883"
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnhanmac.vn&tabs=timeline&width=360&height=110&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=254328106490883"  
            width="100%" // cho iframe chiếm hết chiều ngang div cha
              height="125"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              className=" rounded"
            />
           </div>
            {/* Facebook iframe */}
            
          </div>

          <div className="pt-8 flex">
            <Image
              src="/icons/clock.svg"
              alt="Clock"
              width={36}
              height={36}
              className="mr-2"
            />
            <div>
              <p className="font-bold">Giờ hoạt động:</p>
              <a href="tel:0912424368" className="text-[#2F80ED]">
                Sáng: 8h30 - 12h00 Chiều: 13h30 - 17h30
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="py-2 mt-6  border-t border-[#CFCFCF] text-center text-sm text-white">
        <p>
          Bản quyền bài viết, hình ảnh trên website thuộc về Công ty Cổ phần
          Công Nghệ Thiên Lương. Nghiêm cấm sao chép dưới mọi hình thức.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
