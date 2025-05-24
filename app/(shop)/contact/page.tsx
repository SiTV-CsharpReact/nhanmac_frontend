"use client";

import TitlePage from "@/components/share/TitlePage";

export default function page() {
  return (
    <div className="m-auto grid place-items-center">
      <div className="container">
       <TitlePage text={'Liên hệ'}/>
        <div className="flex flex-col md:flex-row gap-6  bg-white mb-6">
          {/* Thông tin công ty */}

          <div className="md:w-1/3 space-y-3 text-base">
            <h3 className="text-2xl font-bold text-[#2F80ED] uppercase mt-15">
              Công ty cổ phần công nghệ Thiên Lương
            </h3>
            <p className="text-[#2F80ED] font-medium">
              <strong className="text-[#4F4F4F]">Địa chỉ:</strong> Số 41 Phương
              Liệt – Phường Phương Liệt – Quận Thanh Xuân – TP Hà Nội
            </p>
            <p className="text-[#2F80ED] font-medium">
              <strong className="text-[#4F4F4F]">Điện thoại:</strong>{" "}
              0243.6422.572 – 0243.6422.573
            </p>
            <p className="text-[#2F80ED] font-medium">
              <strong className="text-[#4F4F4F]">Mobile/Zalo:</strong>{" "}
              0912.424.368
            </p>
            <p className="text-[#2F80ED] font-medium">
              <strong className="text-[#4F4F4F]">Email:</strong>{" "}
              nhanmac.vn@gmail.com
            </p>
            <p className="text-[#2F80ED] font-medium">
              <strong className="text-[#4F4F4F]">Website:</strong>{" "}
              www.nhanmac.vn
            </p>
          </div>

          {/* Google Map */}
          <div className="md:w-2/3 h-[370px] ">
            <iframe
              title="Bản đồ liên hệ"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.245740408908!2d105.83977187592996!3d21.022150087423236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac6b5be9fdf3%3A0xe70ed0c18d3c33fb!2zNDEgUC4gUGjGsOG7nW5nIExp4buHdCwgUGjGsOG7nW5nIFBoxrDGoW5nIExp4buHdCwgVGhhbmggWHXDom4sIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1714020313285!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
