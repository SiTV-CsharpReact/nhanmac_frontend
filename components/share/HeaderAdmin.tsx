'use client';

import React, { useState } from 'react';
import { Dropdown, Menu, Button, Avatar, message, notification } from 'antd';
import { DownOutlined, UserOutlined, LogoutOutlined, LockOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import ChangePasswordModal from './ChangePasswordModal'; // Đường dẫn chính xác tới file ChangePasswordModal
import { changePassword } from '@/modules/admin/loginApi';

export default function HeaderAdmin() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('username');
   notification.success({ message: 'Đăng xuất thành công!' })
    setTimeout(() => {
  router.push('/login');
}, 1000); 
  };
const handleChangePassword = async (dataVal: { username: string; oldPassword: string; newPassword: string }) => {
  try {
    // Gọi API đổi mật khẩu thực tế
     const data =  await changePassword(dataVal);
     console.log(data)
  data?.Code !== 200
  ? notification.error({ message: data?.Message || 'Có lỗi xảy ra' })
  : notification.success({ message: data?.Message || 'Thành công' });
    setTimeout(() => {
  router.push('/login');
}, 1000); 
  } catch (error: any) {
    message.error(error.message || 'Đổi mật khẩu thất bại!');
    throw error; // Để modal không tự đóng khi lỗi
  }
};

  const menu = (
    <Menu
      items={[
        {
          key: 'change-password',
          icon: <LockOutlined />,
          label: 'Đổi mật khẩu',
          onClick: () => setModalVisible(true),
        },
        {
          key: 'logout',
          icon: <LogoutOutlined style={{ color: 'red' }} />,
          label: <span style={{ color: 'red' }}>Đăng xuất</span>,
          onClick: handleLogout,
        },
      ]}
    />
  );

  return (
    <>
      <header className="w-full flex items-center justify-between bg-white shadow-md px-8 py-4 mb-3">
        <div className="text-2xl font-extrabold text-blue-700 select-none">Quản trị hệ thống</div>

        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" arrow>
          <Button
            type="text"
            className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <Avatar size="small" icon={<UserOutlined />} />
            <span className="text-gray-700 font-medium mr-0">Xin chào, Admin</span>
            <DownOutlined className="text-gray-500" />
          </Button>
        </Dropdown>
      </header>

      <ChangePasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onChangePassword={handleChangePassword}
      />
    </>
  );
}
