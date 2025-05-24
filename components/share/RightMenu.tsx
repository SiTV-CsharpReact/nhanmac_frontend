// components/RightMenu.js
import Image from "next/image";

const RightMenu = () => {
  return (
    <div className="right-3 fixed top-1/2 md:right-7 flex flex-col gap-2 -translate-y-1/2 z-[999]">
      <a
        href="tel:0912424368"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EB5757] text-white text-xl"
      >
        <Image
          src="/icons/phone-call.svg"
          alt="Phone"
          width={30}
          height={30}
          className="wiggle-animation"
        />
      </a>

      <a
        href="https://facebook.com/nhanmac.vn"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2F80ED] text-white text-xl"
      >
        <Image
          src="/icons/brand-facebook-no-border.svg"
          alt="Facebook"
          width={30}
          height={30}
          // className="wiggle-animation"
        />
      </a>

      <a
        href="https://zalo.me/84912424368"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E7E6E6] border-2 border-[#2F80ED] text-white text-xl"
      >
        <Image
          src="/icons/Icon_of_Zalo.svg"
          alt="Zalo"
          width={30}
          height={30}
          className="wiggle-animation"
        />
      </a>

      <a
        href="mailto:nhanmac.vn@gmail.com"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-[#EB5757] text-white text-xl"
      >
        <Image
          src="/icons/brand-gmail-no-border.svg"
          alt="Gmail"
          width={30}
          height={30}
        //   className="w-6 h-6"
        />
      </a>
    </div>
  );
};

export default RightMenu;
