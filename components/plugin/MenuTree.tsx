'use client';
import { useEffect, useState } from 'react';

interface MenuItem {
  id: number;
  name: string;
  alias: string;
  link: string;
  menutype: string;
  published: number;
  menu_type_title: string;
  parent: number;
  children?: MenuItem[];
}

export default function MenuTree() {
  const [menus, setMenus] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch('http://localhost:3600/api/menu') // gọi API từ backend Node.js
      .then(res => res.json())
      .then(data => {
        const menuTree = buildMenuTree(data);
        setMenus(menuTree);
      });
  }, []);

  const buildMenuTree = (items: MenuItem[]) => {
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

  const renderMenu = (menuList: MenuItem[]) => {
    return (
      <ul className="pl-4">
        {menuList.map(menu => (
          <li key={menu.id}>
            <span>{menu.name}</span>
            {menu.children && menu.children.length > 0 && renderMenu(menu.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      {renderMenu(menus)}
    </div>
  );
}
