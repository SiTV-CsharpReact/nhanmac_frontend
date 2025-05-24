// app/page.tsx

import Image from "next/image";
import { Carousel } from "antd";
import SlideImage from "./slide/SlideImage";
import { Metadata } from "next";
import CategoryList from "./components/CategoryList";
import NhanDecal from "./components/NhanDecal";
import TinTuc from "./components/TinTuc";
import Link from "next/link";

// 1. Metadata cho SEO
export const metadata :Metadata= {
  title: "Công ty cổ phần công nghệ Thiên Lương",
  description: "Thiên Lương - Chuyên in ấn các loại tem nhãn mác kim loại, in đề can, in decal, in tem nhôm, in tem vỡ, in decal trong, in tem nhôm xước, nhãn vải, nhãn tem giấy",
  keywords: "tem nhãn mác| tem nhãn| tem mác| nhãn mác| đề can| in decal| decal vỡ | decan nhựa | tem bảo hành | tem nhôm | nhãn nhôm | tem vỡ | decal trong | tem nhôm xước | tem ăn mòn | nhãn mác kim loại | nhan mac kim loai | mác động cơ | mác máy | tem cửa cuốn | nhãn két | mặt nạ két | tem PVC | tem nhôm | tem mica | tem nổi | logo | logo kim loại | logo nhôm | logo đồng, logo inox |",
  authors: [{ name: "VietNamNet News" }],
  creator: "Admin News",
  publisher: "Admin News",
  metadataBase: new URL("https://nhanmac.vn"),
  alternates: {
    canonical: "https://nhanmac.vn",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Công ty cổ phần công nghệ Thiên Lương - Chuyên nhãn mác",
    description: "Thiên Lương - Chuyên in ấn các loại tem nhãn mác kim loại, in đề can, in decal, in tem nhôm, in tem vỡ, in decal trong, in tem nhôm xước, nhãn vải, nhãn tem giấy",
    url: "https://nhanmac.vn",
    siteName: "Nhanmac News",
    images: [
      {
        url: "https://res-files.vnncdn.net/files/2024/1/2/thumb-share-muc.jpg?width=0&s=HSERQwEg5JJy06LMtSHMbw",
        width: 800,
        height: 600,
        alt: "VietNamNet",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Công ty cổ phần công nghệ Thiên Lương - Chuyên nhãn mac",
    description: "Thiên Lương - Chuyên in ấn các loại tem nhãn mác kim loại, in đề can, in decal, in tem nhôm, in tem vỡ, in decal trong, in tem nhôm xước, nhãn vải, nhãn tem giấy",
    images: ["https://nhanmac.vn/templates/nhanmac/favicon.ico"],
    site: "@nhanmac", // nếu có
    creator: "@nhanmac", // nếu có
  },
  verification: {
    google: "T0fsyz7y2VTfHfmaNwV3rjMXPhLOSNXfY93pMqnD5NQ",
  },
  icons: {
    icon: "https://nhanmac.vn/templates/nhanmac/favicon.ico",
    apple: [
      { url: "https://nhanmac.vn/templates/nhanmac/favicon.ico", sizes: "72x72" },
      { url: "https://nhanmac.vn/templates/nhanmac/favicon.ico", sizes: "114x114" },
      { url: "https://nhanmac.vn/templates/nhanmac/favicon.ico", sizes: "57x57" },
    ],
  },
};

const testimonials = [
  {
    comment:
      "Sản phẩm tem nhãn của 3A vượt trội so với các đơn vị khác. Chất lượng, bền màu và đặc biệt là dịch vụ tư vấn rất tận tâm.",
    author: "Ms. Nguyễn Thị An - Công ty May Mặc Tân Bình",
    company: "Công ty May Mặc ",
  },
  {
    comment:
      "3A đã giúp chúng tôi có những mẫu tem nhãn đẹp, ấn tượng. Rất hài lòng về sự chuyên nghiệp và sáng tạo của đội ngũ thiết kế rất tỉ mỉ bắt mắt.",
    author: "Mr. Trần Văn Bình - Cơ sở Da Giày SuperSport",
    company: "Cơ sở Da Giày ",
  },
  {
    comment:
      "Chúng tôi đánh giá cao sự uy tín và chất lượng của 3A. Tem nhãn được giao đúng hẹn, chất lượng đảm bảo, giá cả cạnh tranh mà đem đên chất lượng cùng dịch vụ quá tốt.",
    author: "Mrs. Lê Thị Cúc - HTX Nông Sản Sạch cho mọi nhà",
    company: "HTX Nông Sản 123",
  },
];

export default function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    dotsClass: "slick-dots",
  };

  return (
    <main className="m-auto grid place-items-center mb-12">
      {/* 1. Slide banner */}
      <div className="container my-4">
        <SlideImage />
        <h1 className="text-center text-[28px] mt-8 font-semibold md:text-[32px]">
          Bạn đang tìm đơn vị sản xuất tem nhãn uy tín?
        </h1>

        {/* 2. Thông tin công ty & số liệu */}
        <section className="grid grid-cols-1 md:grid-cols-12 mt-6 px-1 md:px-20 gap-1 md:gap-0">
          <div className="flex flex-col gap-1 text-[#2F80ED] col-span-1 md:col-span-4 md:gap-6">
            {/* Kinh nghiệm */}
            <div className="flex items-center gap-4">
              <div className="w-21.5 h-21.5 rounded-full bg-[#62A3FC] border-2 border-[#2F80ED] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-3 border-[#fff]">
                  <div className="relative mt-1 text-[46px] font-semibold text-white">
                    <span className="absolute left-3 tracking-[-4px]">10</span>
                    <span className="absolute text-2xl font-bold left-13 top-3.5">
                      <Image src="/icons/+.svg" width={12} height={12} alt="Thêm 10 năm kinh nghiệm" />
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-base font-medium animate-subtitle animate-slide-left">
                Hơn 10 năm kinh nghiệm
              </span>
            </div>
            {/* Số lượng khách hàng */}
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <div className="w-21.5 h-21.5 rounded-full bg-[#62A3FC] border-2 border-[#2F80ED] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-3 border-[#fff]">
                  <div className="relative text-[19px] font-semibold text-white">
                    <span className="absolute text-[22px] left-0.5 top-5 tracking-[-1px]">
                      20.000
                      <Image
                            src="/icons/+.svg"
                            width={11}
                            height={11}
                            alt="Thêm 20000 khách hàng"
                            className="absolute left-14 top-0.5"
                          />
                    </span>
                    
                  </div>
                </div>
              </div>
              <span className="text-base font-medium animate-subtitle animate-slide-left">
                Khoảng 20.000 khách hàng đã tin tưởng và sử dụng
              </span>
            </div>
          </div>
          <div className="col-span-1 md:col-span-8 md:ml-39 text-center md:text-right mt-2 md:mt-0">
            <div className="text-right mb-12">
              <span className="text-[#2F80ED] font-semibold text-2xl animate-slide-right">
                CÔNG TY CỔ PHẦN CÔNG NGHỆ THIÊN LƯƠNG
              </span>
              <br />
              <span className="block max-w-3xl mx-auto text-base font-medium mt-4.5 animate-slide-right ">
                Với phương châm <strong>&quot;Nỗ lực hết mình vì mục tiêu khách hàng đặt ra&quot;</strong>, chúng tôi không ngừng hoàn thiện, nâng cấp máy móc, tăng cường sáng tạo, biết lắng nghe để thấu hiểu ý tưởng và đáp ứng yêu cầu Quý khách. Tem nhãn mác của chúng tôi góp phần nâng cao giá trị sản phẩm của bạn.
              </span>
              <div className="mt-2">
                <Link className="flex float-right" href="/tem-nhan-mac-cong-ty-thien-luong-307.html" title="Đọc thêm về Thiên Lương">
                  <span className="text-[#2F80ED] font-medium text-base mr-0.5 animate-slide-right ">
                    Đọc thêm
                  </span>
                  <Image
                    className="transform transition-all duration-300 group-hover:translate-x-1 animate-arrow"
                    src={"/icons/arrow-big-right-lines.svg"}
                    width={24}
                    height={27}
                    alt="Đọc thêm"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Danh mục sản phẩm */}
      <section className="w-full mb-13 mt-10">
 
        <CategoryList categoryKey='nhan-kim-loai' bgWhite={false}/>
  
        {/* <TemNhuaList /> */}
        {/* <TemQRCode /> */}
        <div className="grid place-items-center mt-4">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NhanDecal textTitle="Nhãn Vải" categoryKey="nhan-vai"/>

              <NhanDecal textTitle="Nhãn Decal" categoryKey="nhan-decal-"/>
            </div>
          </div>
        </div>
        <CategoryList categoryKey='nhan-kim-loai' bgWhite={true}/>

      </section>

      {/* Testimonial */}
      <section className="grid place-items-center">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#EAF2FE] pb-1.5 px-2 md:px-5 pt-5">
              <h2 className="text-2xl md:text-[32px] font-semibold text-center ">
                CẢM NHẬN KHÁCH HÀNG
              </h2>
              <div className="h-1 bg-[#2F80ED] mx-auto w-[255px] mb-2.5"></div>
              <Carousel {...settings} className="pb-8">
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.author + index} className="bg-white">
                    <div className="grid grid-cols-12 gap-5 p-5">
                      <div className="col-span-2 flex items-start gap-2">
                        <Image
                          src="/icons/Vector.svg"
                          width={41}
                          height={18}
                          alt="Icon đánh giá"
                          className="h-10 w-10 md:h-15 md:w-10"
                        />
                        <Image
                          src="/icons/Vector.svg"
                          width={41}
                          height={18}
                          alt="Icon đánh giá"
                          className="h-10 w-10 md:h-15 md:w-10"
                        />
                      </div>
                      <div className="col-span-10 ml-4">
                        <blockquote className="block text-base text-gray-700 leading-relaxed">
                          {testimonial.comment}
                        </blockquote>
                        <div className="flex gap-1 pb-1.5 pt-0.5 mb-2 border-b-1 border-[#CFCFCF]">
                          {[...Array(5)].map((_, idx) => (
                            <Image
                              key={idx}
                              src="/icons/star.svg"
                              width={24}
                              height={24}
                              alt="star"
                            />
                          ))}
                        </div>
                        <div className="mb-3">
                          <span className="text-base font-bold">
                            {testimonial.author} - {testimonial.company}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
           <TinTuc/>
            {/* ... Tin tức hoặc các section khác */}
          </div>
        </div>
      </section>
    </main>
  );
}
