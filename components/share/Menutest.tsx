'use client';
import { useEffect, useState } from 'react';
import { MenuUnfoldOutlined, MenuFoldOutlined, CaretDownOutlined, } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchMenus } from "@/modules/client/menuApi";
import { notification } from 'antd';
import { MenuItem } from '@/types/MenuItem';
import Link from 'next/link';
import Cookies from 'js-cookie';
export default function MenuTest() {
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);        // mở cấp 2
    const [openSubMenuId, setOpenSubMenuId] = useState<number | null>(null);  // mở cấp 3
    const [mobileOpenMenuId, setMobileOpenMenuId] = useState<number | null>(null);     // menu cấp 1
    const [mobileOpenSubMenuId, setMobileOpenSubMenuId] = useState<number | null>(null); // menu cấp 2
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
    const [activeSubMenuId, setActiveSubMenuId] = useState<number | null>(null); // menu cấp 2
    const toggleMobileMenu = (id: number) => {
        setMobileOpenMenuId(prev => prev === id ? null : id);
        setMobileOpenSubMenuId(null); // reset submenu khi đổi menu
    };

    const toggleMobileSubMenu = (id: number) => {
        setMobileOpenSubMenuId(prev => prev === id ? null : id);
    };

    // Load menu
    const loadMenus = async () => {
        // setLoading(true);
        try {
            const data = await fetchMenus();
            const sorted = data.Data.sort((a, b) => a.ordering - b.ordering);
            const tree = buildTree(sorted);
            setMenus(tree);
        } catch (e: any) {
            notification.error({ message: "Lỗi", description: e.message });
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        loadMenus()
    }, []);

    const buildTree = (items: MenuItem[]) => {
        const map: Record<number, MenuItem> = {};
        const roots: MenuItem[] = [];

        items.forEach(item => {
            item.children = [];
            map[item.id] = item;
        });

        items.forEach(item => {
            if (item.parent && map[item.parent]) {
                map[item.parent].children?.push(item);
            } else {
                roots.push(item);
            }
        });

        return roots;
    };

    const handleClick = (link: string, id?: number, parentId?: number,nameParent?:string) => {
        // console.log(nameParent)
        if (id) setActiveSubMenuId(id);         // đánh dấu menu con
        if (parentId) setActiveMenuId(parentId); // đánh dấu menu cha
        nameParent&& Cookies.set('activeParent', nameParent); 
        const url = '/' + link.replace(/^index\.php\?/, '').replace(/&/g, '/').replace(/=/g, '-');
        router.push(url);
        setOpen(false)
      };

    const renderMenuHorizontal = (items: MenuItem[]) => {
        return (
            <ul className="flex flex-wrap text-[#1f2b46] items-center justify-start py-1 gap-4">
                <Link href={'/'} className=' !mr-[7%]'>
                <Image
                    src="/images/logo.png"
                    width={56}
                    height={20}
                    alt="Logo"
                    className="mx-auto md:mx-0"
                />
                </Link>
               
                {items.map(item => {
                    // if (item?.parent !== 0 || item?.published !== 1) return null;
                    return (
                        <li
                            key={item.id}
                            onMouseEnter={() => setOpenMenuId(item.id)}
                            onMouseLeave={() => setOpenMenuId(null)}
                            className="relative"
                        >
                            <button
                         onClick={() => handleClick(item.link, item.id,100,item.name)}
                         className={`uppercase font-bold text-sm py-1 transition flex items-center gap-0.5 hover:text-[#589fff] ${
                            activeMenuId === item.id ? 'text-[#589fff]' : ''
                          }`}
                            >
                                {item.name}
                                {item.children && item.children.length > 0 && (
                                    <CaretDownOutlined className="text-inherit" />
                                )}
                            </button>

                            {item.children && item.children.length > 0 && openMenuId === item.id && (
                                <ul className="absolute left-0 top-full min-w-[220px] bg-[#EAF2FE] rounded shadow-lg z-50 border border-[#4B465C1A]">
                                    {item.children.map((sub) => (
                                        <li
                                            key={sub.id}
                                            onMouseEnter={() => setOpenSubMenuId(sub.id)}
                                            onMouseLeave={() => setOpenSubMenuId(null)}
                                            className="relative"
                                        >
                                            <button
                                                  onClick={() => handleClick(sub.link, sub.id, item.id,item.name)}
                                                  className={`block w-full text-left px-4 py-2 hover:bg-[#589fff] hover:text-white hover:shadow-lg cursor-pointer ${
                                                    activeSubMenuId === sub.id ? 'bg-[#589fff] text-white' : ''
                                                  }`}
                                            >
                                                {sub.name}
                                            </button>


                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };

    const renderMenuMobile = (items: MenuItem[]) => (
        <ul className="flex flex-col gap-2">
            {items.map(item => (
                <li key={item.id}>
                    <div className="flex justify-between items-center">
                        <button
                             onClick={() => handleClick(item.link)}
                            className="text-left font-semibold text-[#1f2b46] uppercase w-full py-2"
                        >
                            {item.name}
                        </button>
                        {item.children && item.children.length > 0 && (
                            <button onClick={() => toggleMobileMenu(item.id)} className="px-2">
                                <CaretDownOutlined
                                    className={`transition-transform ${mobileOpenMenuId === item.id ? 'rotate-180 text-[#589fff]' : ''
                                        }`}
                                />
                            </button>
                        )}
                    </div>

                    {/* Menu cấp 2 */}
                    {item.children && item.children.length > 0 && mobileOpenMenuId === item.id && (
                        <ul className="pl-4 border-l border-gray-300 ml-2">
                            {item.children.map(sub => (
                                <li key={sub.id}>
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => handleClick(sub.link)}
                                            className="text-left w-full py-2 text-sm text-[#1f2b46]"
                                        >
                                            {sub.name}
                                        </button>
                                        {sub.children && sub.children.length > 0 && (
                                            <button onClick={() => toggleMobileSubMenu(sub.id)} className="px-2">
                                                <CaretDownOutlined
                                                    className={`transition-transform ${mobileOpenSubMenuId === sub.id ? 'rotate-180 text-[#589fff]' : ''
                                                        }`}
                                                />
                                            </button>
                                        )}
                                    </div>

                                    {/* Menu cấp 3 */}

                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );


    return (
        <div className="bg-[#EAF2FE] shadow-custom-md">
            <div className="container mx-auto py-2 flex justify-between items-center relative">
                <button
                    className="md:hidden text-white bg-[#2F80ED] px-2 py-1 ml-1 rounded"
                    onClick={() => setOpen(!open)}
                >
                    {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </button>


                <div className="absolute left-1/2 -translate-x-1/2 md:hidden md:translate-x-0">
                <Link href={'/'} >
                    <Image
                        src="/images/logo.png"
                        width={56}
                        height={20}
                        alt="Logo"
                        className="md:mx-0"
                    />
                    </Link>
                </div>
                {/* Desktop menu */}
                <nav className="hidden md:block">
                    {renderMenuHorizontal(menus)}
                </nav>

                {/* Mobile menu */}
                {open && (
                    <div className="absolute top-full left-0 w-full bg-white shadow p-4 md:hidden z-50">
                        <nav>{renderMenuMobile(menus)}</nav>
                    </div>
                )}
            </div>
        </div>
    );
}
