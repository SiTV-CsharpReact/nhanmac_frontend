"use client";

import { useResponsiveMenu } from "@/hooks/useReponsiveMenu";
import { MenuItem } from "@/types/MenuItem";
import { CaretDownOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

/* ================= HELPER ================= */

const buildUrl = (link: string) =>
  "/" +
  link
    .replace(/^index\.php\?/, "")
    .replace(/&/g, "/")
    .replace(/=/g, "-");

const normalize = (url: string) => url.replace(/\/+$/, "");

const isActive = (link: string, pathname: string) => {
  const menuUrl = normalize(buildUrl(link));
  const current = normalize(pathname);
  return current === menuUrl || current.startsWith(menuUrl + "/");
};

const hasActiveChild = (item: MenuItem, pathname: string) =>
  item.children?.some(
    (child) =>
      isActive(child.link, pathname) ||
      child.children?.some((sub) => isActive(sub.link, pathname))
  );

/* ================= COMPONENT ================= */

export default function MenuClient({
  menus,
  pathname,
}: {
  menus: MenuItem[];
  pathname: string;
}) {
  const containerRef = useRef<HTMLUListElement>(null);
  const mobileRef = useRef<HTMLDetailsElement>(null);
  const measureRef = useRef<HTMLUListElement>(null);

  const closeMobile = () => {
    if (mobileRef.current) {
      mobileRef.current.open = false;
    }
  };
  const { visible, overflow } = useResponsiveMenu(
    menus,
    containerRef,
    measureRef
  );

  return (
    <header className="bg-[#EAF2FE] shadow-custom-md">
      <div className="px-2">
        {/* ================= MOBILE ================= */}
        <div className="md:hidden">
          <details ref={mobileRef} className="group">
            <summary className="list-none cursor-pointer flex items-center justify-between px-2 py-1 pl-3">
              <div className="bg-[#2F80ED] text-white p-1.5 rounded">☰</div>

              <Link href="/" onClick={closeMobile}>
                <Image
                  src="/images/logo.png"
                  width={46}
                  height={15}
                  alt="Logo"
                />
              </Link>

              <div className="w-10" />
            </summary>

            <div className="bg-white border-t px-4 py-4">
              <ul className="flex flex-col gap-3">
                {menus.map((item) => {
                  const active =
                    isActive(item.link, pathname) ||
                    hasActiveChild(item, pathname);

                  return (
                    <li key={item.id}>
                      {!item.children?.length ? (
                        <Link
                          href={buildUrl(item.link)}
                          onClick={closeMobile}
                          className={`uppercase font-semibold ${
                            active ? "text-[#589fff]" : "text-[#1f2b46]"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <>
                          <div className="flex justify-between items-center">
                            <Link
                              href={buildUrl(item.link)}
                              onClick={closeMobile}
                              className={`uppercase font-semibold ${
                                active ? "text-[#589fff]" : "text-[#1f2b46]"
                              }`}
                            >
                              {item.name}
                            </Link>
                            <CaretDownOutlined />
                          </div>

                          <ul className="pl-4 mt-2 border-l border-gray-300">
                            {item.children.map((sub) => {
                              const subActive = isActive(sub.link, pathname);

                              return (
                                <li key={sub.id} className="py-1">
                                  <Link
                                    href={buildUrl(sub.link)}
                                    onClick={closeMobile}
                                    className={`text-sm ${
                                      subActive
                                        ? "text-[#589fff]"
                                        : "text-[#1f2b46]"
                                    }`}
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </details>
        </div>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:block">
          <div className="container mx-auto flex items-center py-2 pl-2">
            <Link href="/" className="mr-6">
              <Image src="/images/logo.png" width={56} height={20} alt="Logo" />
            </Link>

            {/* ===== WRAPPER ĐỂ ĐO WIDTH ===== */}
            <nav className="flex-grow relative flex justify-center items-center">
              <div ref={containerRef} className="max-w-full">
                <ul className="flex gap-6 whitespace-nowrap">
                  {visible.map((item) => {
                    const active = isActive(item.link, pathname);

                    return (
                      <li key={item.id} className="relative group">
                        <Link
                          href={buildUrl(item.link)}
                          className={`uppercase font-bold text-sm flex items-center gap-1
                          ${
                            active ? "text-[#589fff]" : "hover:text-[#589fff]"
                          }`}
                        >
                          {item.name}
                          {item.children?.length > 0 && <CaretDownOutlined />}
                        </Link>
                        {/* DROPDOWN */}
                        {item.children?.length > 0 && (
                          <ul
                            className="
                      absolute top-full left-0 min-w-[220px]
                      bg-[#EAF2FE] border border-[#4B465C1A] rounded
                      opacity-0 invisible
                      group-hover:opacity-100 group-hover:visible
                      transition  z-50
                    "
                          >
                            {item.children.map((sub) => (
                              <li key={sub.id}>
                                <Link
                                  href={buildUrl(sub.link)}
                                  className="block px-4 py-2 hover:bg-[#589fff] hover:text-white"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                  {overflow.length > 0 && (
                    <li className="relative group shrink-0">
                      <div className="uppercase font-bold text-sm cursor-pointer">
                        ...
                      </div>

                      <ul
                        className="absolute top-full right-0 min-w-[220px] bg-[#EAF2FE] border rounded
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible transition"
                      >
                        {overflow.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={buildUrl(item.link)}
                              className="block px-4 py-2 hover:bg-[#589fff] hover:text-white"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </ul>
                {/* ===== MEASURE LIST (ẨN) ===== */}
                <ul
                  ref={measureRef}
                  className="absolute invisible pointer-events-none whitespace-nowrap flex gap-6"
                >
                  {menus.map((item) => (
                    <li key={item.id} className="uppercase font-bold text-sm">
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
