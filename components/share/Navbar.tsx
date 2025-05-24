'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Next.js 13+
import { Menu } from 'antd';
import {
  ContainerOutlined,
  FileImageOutlined,
  HddOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '/dashboard/menu',
    label: 'Quản lý menu',
    icon: <MenuOutlined />,
  },
  {
    key: '/dashboard/posts',
    label: 'Quản lý slider',
    icon: <FileImageOutlined />,
  },
  {
    key: '/dashboard/category',
    label: 'Quản lý chuyên mục',
    icon: <HddOutlined />,
  },
  {
    key: '/dashboard/article',
    label: 'Quản lý bài viết',
    icon: <ContainerOutlined />,
  },
  {
    type: 'divider',
  },
];

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Lấy route hiện tại

  const onClick: MenuProps['onClick'] = (e) => {
    router.push(e.key); // Chuyển hướng đến route tương ứng
  };

  return (
    <Menu
      onClick={onClick}
      style={{ width: 256,cursor:'pointer',height: 'calc(100vh - 70px)'}}
      selectedKeys={[pathname]} // LUÔN active đúng route hiện tại
      mode="inline"
      items={items}
      
    />
  );
};

export default Navbar;
