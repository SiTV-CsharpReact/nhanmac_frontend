"use client";
import { Carousel } from "antd";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchSlides } from "@/modules/client/hompageApi";
import { Post } from "@/types/contentItem";
import Link from "next/link";

const SlideImage = () => {
  const [slides, setSlides] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const response = await fetchSlides();
        if (response.Code === 200 && response.Data) {
          setSlides(response.Data);
        }
      } catch (error) {
        console.error("Lỗi khi tải slides:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSlides();
  }, []);

  if (loading) {
    return (
      <section
        aria-label="Loading slides"
        className="h-[515px] bg-gray-100 animate-pulse"
      />
    );
  }

  if (!slides.length) {
    return null;
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dotsClass: "slick-dots",
  };

  return (
    <section
      aria-label="Slideshow"
      className="grid grid-cols-1 lg:grid-cols-12 gap-4"
    >
      <div className="lg:col-span-7">
        <Carousel {...settings} className="mb-2.5">
          {slides.slice(0, 3).map((slide) => (
            // console.log(`https://nhanmac.vn/${slide.urls}`),
            <div
              key={slide.id}
              role="group"
              aria-label={`Slide ${slide.title}`}
              className="relative"
            >
              <Link href={`/${slide.alias}-${slide.id}.html`} title={slide.title}>
                <Image
                  src={`https://nhanmac.vn/${slide.urls}`}
                  width={764}
                  height={515}
                  alt={slide.title || "Slide image"}
                  title={slide.title}
                  style={{ height: "515px", objectFit: "cover" }}
                  priority={true}
                  loading="eager"
                />
                {/* Overlay title */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-10 w-[500px] bg-white/60 text-[#2f80ed] text-lg font-semibold px-6 py-3 text-center rounded-lg">
                  {slide.title}
                </div>
              </Link>
            </div>
          ))}
        </Carousel>
      </div>

      {/* 3/12 = 25 % */}
      <aside className="lg:col-span-5" aria-label="Related slides">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full overflow-auto pb-2.5">
          {slides.slice(3, 7).map((item) => (
            <article
              key={item.id}
              className="flex flex-col h-full cursor-pointer bg-white shadow-custom hover:shadow--md transition overflow-hidden"
            >
              <Link href={`/${item.alias}-${item.id}.html`} title={item.title} className="group bg-white rounded  cursor-pointer">
                <Image
                   src={`https://nhanmac.vn/${item.urls}`}
                  alt={item.title || "Slide image"}
                  title={item.title}
                  width={300}
                  height={180}
                  className="h-[180px] w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  priority={true}
                  loading="eager"
                />
                <h3 className="text-[16px] p-2 pt-3  font-normal leading-5 text-[#2F80ED] group-hover:text-orange-500">
                  {item.title}
                </h3>
              </Link>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
};

export default SlideImage;
