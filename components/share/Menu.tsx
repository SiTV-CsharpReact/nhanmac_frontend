"use client";
import { useEffect, useState } from "react";
import {
  CaretDownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "TRANG CHỦ", value: "/" },
  { label: "GIỚI THIỆU", value: "/gioi-thieu" },
  {
    label: "TEM KIM LOẠI",
    value: "/san-pham",
    children: [
      { label: "TEM KIM LOẠI", value: "/products/tem-kim-loai" },
      { label: "TEM NHỰA DA-MICA", value: "/products/tem-nhua-da-mica" },
      { label: "TEM QR CODE", value: "/products/tem-qr-code" },
      { label: "NHÃN DECAN", value: "/products/nhan-decan" },
      { label: "NHÃN VẢI", value: "/products/nhan-vai" },
      { label: "TEM NGÀNH NGHỀ", value: "/products/tem-nganh-nghe" },
    ],
    icon: true,
  },
  { label: "TIN TỨC", value: "/news" },
  { label: "LIÊN HỆ", value: "/contact" },
];

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuStatus, setMenuStatus] = useState<"open" | "close">("close");
  const [activePath, setActivePath] = useState<string>("/");
  const [activeParent, setActiveParent] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedPath = localStorage.getItem("activePath");
    const storedParent = localStorage.getItem("activeParent");
    if (storedPath) setActivePath(storedPath);
    if (storedParent) setActiveParent(storedParent);
  }, []);

  useEffect(() => {
    if (open) {
      setShowMenu(true);
      setTimeout(() => setMenuStatus("open"), 20);
    } else {
      setMenuStatus("close");
      const timer = setTimeout(() => setShowMenu(false), 400);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClick = (value: string, parentLabel?: string) => {
    setActivePath(value);
    localStorage.setItem("activePath", value);

    if (parentLabel) {
      setActiveParent(parentLabel);
      localStorage.setItem("activeParent", parentLabel);
    } else {
      setActiveParent(null);
      localStorage.removeItem("activeParent");
    }

    router.push(value);
    setOpen(false);
    setOpenSubMenu(null);
  };

  const toggleSubMenu = (label: string) => {
    setOpenSubMenu((prev) => (prev === label ? null : label));
  };

  return (
    <div className="bg-[#EAF2FE] shadow-custom-md">
      <div className="mx-auto py-2 flex items-center justify-between md:justify-between container relative">
        {/* Nút menu mobile */}
        <button
          className="md:hidden text-white bg-[#2F80ED] px-2 py-1 ml-1 rounded z-50"
          onClick={() => setOpen(!open)}
        >
          {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>

        {/* Logo */}
        <Image
          src="/images/logo.png"
          width={56}
          height={20}
          alt="Logo"
          className="mx-auto md:mx-0 absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0"
        />

        {/* Menu desktop */}
        <nav className="hidden md:flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-[#1f2b46] px-7 relative">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              <button
                onClick={() => {
                  if (!item.children) handleClick(item.value);
                }}
                className={`cursor-pointer hover:text-[#2F80ED] ${
                  activePath === item.value || activeParent === item.label
                    ? "text-[#2F80ED] font-bold"
                    : ""
                }`}
              >
                {item.label}
                {item?.icon && <CaretDownOutlined />}
              </button>

              {/* Submenu desktop */}
              {item.children && (
                <div className="absolute border border-[#4B465C1A] top-full left-0 w-48 bg-[#EAF2FE] shadow-custom-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity z-50">
                  {item.children.map((child) => (
                    <button
                      key={child.value}
                      onClick={() => handleClick(child.value, item.label)}
                      className={`block w-full text-left px-4 py-2 hover:shadow-custom-lg hover:bg-[#589fff] hover:text-white cursor-pointer ${
                        activePath === child.value ? "text-[#2F80ED] font-bold" : ""
                      }`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Placeholder div cho căn chỉnh */}
        <div></div>

        {/* Menu mobile */}
        {showMenu && (
          <div
            className={`md:hidden absolute top-full left-0 w-full z-50 bg-[#EAF2FE] px-4 text-sm font-semibold text-[#1f2b46] dropdown-transition ${
              menuStatus === "open" ? "dropdown-open" : "dropdown-close"
            }`}
          >
            {navItems.map((item) => (
              <div key={item.label}>
                <button
                  onClick={() => {
                    if (item.children) {
                      toggleSubMenu(item.label);
                    } else {
                      handleClick(item.value);
                    }
                  }}
                  className={`block w-full text-left py-2 hover:text-[#2F80ED] flex justify-between items-center ${
                    activePath === item.value || activeParent === item.label
                      ? "text-[#2F80ED] font-bold"
                      : ""
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <span className="ml-2">{openSubMenu === item.label ? "▲" : "▼"}</span>
                  )}
                </button>

                {/* Submenu mobile */}
                {item.children && openSubMenu === item.label && (
                  <div className="pl-4">
                    {item.children.map((child) => (
                      <button
                        key={child.value}
                        onClick={() => handleClick(child.value, item.label)}
                        className={`block w-full text-left py-2 hover:text-[#2F80ED] ${
                          activePath === child.value ? "text-[#2F80ED] font-bold" : ""
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


