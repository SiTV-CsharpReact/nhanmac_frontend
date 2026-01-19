import Link from "next/link";
import Image from "next/image";
import { MenuItem } from "@/types/MenuItem";
import { CaretDownOutlined } from "@ant-design/icons";

export default function MenuClient({ menus }: { menus: MenuItem[] }) {
  return (
    <header className="bg-[#EAF2FE] shadow-custom-md">
      <div className=" px-2 ">
        {/* ================= MOBILE HEADER ================= */}
        <div className="md:hidden">
          <details className="group">
            {/* HEADER BAR */}
            <summary className="list-none cursor-pointer flex items-center justify-between px-2 py-1 pl-3">
              {/* ICON ☰ */}
              <div className="bg-[#2F80ED] text-white p-1.5 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>

              {/* LOGO */}
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  width={46}
                  height={15}
                  alt="Logo"
                />
              </Link>

              {/* giữ layout cân */}
              <div className="w-10" />
            </summary>

            {/* MOBILE MENU */}
            <div className="md:hidden bg-white border-t px-4 py-4">
              <ul className="flex flex-col gap-3">
                {menus.map((item) => (
                  <li key={item.id}>
                    {!item.children?.length ? (
                      <Link
                        href={buildUrl(item.link)}
                        className="uppercase font-semibold text-[#1f2b46]"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <div>
                        {/* HEADER */}
                        <div className="flex justify-between items-center">
                          {/* CLICK ĐI LINK */}
                          <Link
                            href={buildUrl(item.link)}
                            className="uppercase font-semibold text-[#1f2b46]"
                          >
                            {item.name}
                          </Link>

                          {/* TOGGLE */}
                          <label
                            htmlFor={`menu-${item.id}`}
                            className="cursor-pointer"
                          >
                            <CaretDownOutlined />
                          </label>
                        </div>

                        {/* INPUT PHẢI Ở ĐÂY */}
                        <input
                          type="checkbox"
                          id={`menu-${item.id}`}
                          className="peer hidden"
                        />

                        {/* MENU CẤP 2 – peer-checked */}
                        <ul className="pl-4 mt-2 border-l border-gray-300 hidden peer-checked:block">
                          {item.children.map((sub) => (
                            <li key={sub.id} className="py-1">
                              {!sub.children?.length ? (
                                <Link
                                  href={buildUrl(sub.link)}
                                  className="text-sm text-[#1f2b46]"
                                >
                                  {sub.name}
                                </Link>
                              ) : (
                                <div>
                                  <div className="flex justify-between items-center">
                                    <Link
                                      href={buildUrl(sub.link)}
                                      className="text-sm"
                                    >
                                      {sub.name}
                                    </Link>

                                    <label
                                      htmlFor={`submenu-${sub.id}`}
                                      className="cursor-pointer"
                                    >
                                      <CaretDownOutlined />
                                    </label>
                                  </div>

                                  <input
                                    type="checkbox"
                                    id={`submenu-${sub.id}`}
                                    className="peer hidden"
                                  />
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>

        {/* ================= DESKTOP MENU ================= */}
        <div className="hidden md:block">
          <div className="container mx-auto flex items-center py-2 pl-2">
            {/* LOGO */}
            <Link href="/" className="mr-6">
              <Image src="/images/logo.png" width={56} height={20} alt="Logo" />
            </Link>

            {/* MENU */}
            <nav className="flex-grow flex justify-center">
              <ul className="flex gap-6">
                {menus.map((item) => (
                  <li key={item.id} className="relative group">
                    <Link
                      href={buildUrl(item.link)}
                      className="uppercase font-bold text-sm flex items-center gap-1 hover:text-[#589fff]"
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
                      transition
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
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ================= HELPER ================= */
const buildUrl = (link: string) =>
  "/" +
  link
    .replace(/^index\.php\?/, "")
    .replace(/&/g, "/")
    .replace(/=/g, "-");
