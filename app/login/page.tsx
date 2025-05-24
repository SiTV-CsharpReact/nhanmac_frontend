"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import "../globals.css";
import {  useRouter } from 'next/navigation';
import { login } from "@/modules/admin/loginApi";
import Cookies from 'js-cookie';

// import { login } from "@/api/authApi"; // ✅ Gọi API login từ file riêng

const Page = () => {
  const router = useRouter();
const [loading, setLoading] = useState(false); // loading state
  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      const data = await login(values); // ✅ Dùng hàm login
      message.success("Đăng nhập thành công!");
      Cookies.set('access_token', data.Data.usertype, { expires: 1 });
      // cookies.setItem("access_token", data.Data.usertype);
      router.push('/dashboard/menu');
    } catch (error: any) {
      message.error(error.message || "Lỗi đăng nhập");
    }
    finally{
       setLoading(false); // stop loading
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg flex w-full max-w-4xl overflow-hidden">
        {/* Bên trái: Hình ảnh minh họa */}
        <div className="w-1/2 bg-[#f5dcc0] hidden md:flex items-center justify-center">
          <Image
            src="/images/logo.png"
            width={200}
            height={80}
            alt="not found"
            // className="w-full h-full"
            priority
          />
        </div>

        {/* Bên phải: Form login */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Đăng nhập</h2>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full" disabled={loading} loading={loading}>
                Đăng nhập
              </Button>
            </Form.Item>

           
          </Form>
        </div>
      </div>
    </main>
  );
};

export default Page;
