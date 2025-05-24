import React from "react";
import Image from "next/image"; // Bắt buộc với Next.js
// import Menu from "./Menu";
import MenuTest from "./Menutest";

// Tách số online thành Client Component để tránh hydration mismatch
const OnlineCount = () => {
  return (
    <span className="ml-auto h-7 bg-[#F2F2F2] text-[#27AE60] px-2 py-1 font-normal flex items-center gap-1 border border-[#27AE60] rounded-[5px]">
      <Image
        src="/icons/Rectangle.svg"
        alt="Đang trực tuyến"
        width={10}
        height={10}
        className="w-2.5 h-2.5"
      />
      {Math.floor(Math.random() * 96) + 5} Trực tuyến
    </span>
  );
};

const Header = () => {
  return (
    <header className="sticky top-0 z-40" aria-label="Header">
      <address className="not-italic w-full bg-[#2F80ED] flex justify-center hidden md:flex">
        <div className=" container flex justify-between  items-center text-white text-sm ">
          <div className="pl-2 py-2 flex flex-wrap items-center gap-2">

          {/* Điện thoại */}
          <a
            href="tel:0912424368"
            className="flex items-center gap-0.5 hover:underline"
            title="Gọi 0912.424.368"
            aria-label="Gọi 0912.424.368"
          >
            <Image
              src="/icons/phone-call.svg"
              alt="Gọi điện thoại"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-xl">0912.424.368</span>
          </a>

          {/* Zalo */}
          <a
            href="https://zalo.me/84912424368"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 hover:underline"
            title="Nhắn Zalo"
            aria-label="Nhắn Zalo"
          >
            <Image
              src="/icons/Icon_of_Zalo.svg"
              alt="Zalo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com/nhanmac.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 hover:underline"
            title="Facebook Nhanmac.vn"
            aria-label="Facebook Nhanmac.vn"
          >
            <Image
              src="/icons/brand-facebook.svg"
              alt="Facebook"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </a>

          {/* Mail */}
          <a
            href="mailto:nhanmac.vn@gmail.com"
            className="flex items-center gap-0.5 hover:underline"
            title="Gửi email"
            aria-label="Gửi email"
          >
            <Image
              src="/icons/brand-gmail.svg"
              alt="Gmail"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </a>
          </div>
          <div className="marquee-wrapper flex justify-center overflow-hidden max-w-[500px] w-full relative mx-auto">
            <div className="marquee-text text-base">
              Nhà chuyên sản xuất tem nhãn mác trên mọi chất liệu ✨
            </div>
          </div>
          {/* Số người trực tuyến */}
          <OnlineCount />
        </div>
      </address>
      <nav aria-label="Main menu">
        <MenuTest />
      </nav>
    </header>
  );
};

export default Header;
