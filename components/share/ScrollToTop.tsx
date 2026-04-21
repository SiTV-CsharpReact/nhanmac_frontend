'use client';

import { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Hiển thị nút khi cuộn xuống 300px
  const toggleVisibility = () => {
    // Tính toán phần trăm cuộn
    const winScroll = window.pageYOffset;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    setScrollProgress(scrolled);
    setIsVisible(winScroll > 300);
  };

  // Cuộn lên đầu trang với animation mượt
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Điều chỉnh radius cho phù hợp với kích thước w-12 (48px)
  const radius = 22;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="relative w-12 h-12 flex items-center justify-center group cursor-pointer"
          aria-label="Cuộn lên đầu trang"
        >
          {/* Background Circle */}
          <div className="absolute inset-0 bg-[#2F80ED] rounded-full opacity-80"></div>

          {/* Progress Circle */}
          <svg className="absolute w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-300"
            />
          </svg>

          {/* Arrow Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white z-10 transition-transform duration-300 group-hover:-translate-y-1 relative"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>

          {/* Percentage Text */}
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-medium bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {Math.round(scrollProgress)}%
          </span>
        </button>
      )}
    </>
  );
};

export default ScrollToTop; 