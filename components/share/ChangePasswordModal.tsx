'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import Cookies from 'js-cookie';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onChangePassword: (data: { username: string; oldPassword: string; newPassword: string }) => Promise<void>;
}

export default function ChangePasswordModal({ visible, onClose, onChangePassword }: ChangePasswordModalProps) {
  const [form] = Form.useForm();
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = Cookies.get('username');
    form.setFieldValue('username',user);
    setUsername(user);
  }, [visible]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!username) {
        message.error('Không lấy được tên tài khoản từ cookie.');
        return;
      }
      setLoading(true);
      await onChangePassword({
        username,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success('Đổi mật khẩu thành công!');
      form.resetFields();
      onClose();
    } catch (error) {
      // Validation lỗi hoặc onChangePassword lỗi sẽ được xử lý ở onChangePassword hoặc message bên ngoài
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText="Xác nhận"
      cancelText="Hủy"
      confirmLoading={loading}
             styles={{ body: { paddingBottom: 8, padding: 16 },footer: { paddingBottom: 8, padding: 16 } }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="change_password_form">
        <Form.Item label="Tài khoản" name="username">
          <Input value={username} disabled />
        </Form.Item>

        <Form.Item
          label="Mật khẩu cũ"
          name="oldPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu cũ" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            { min: 6, message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmNewPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu mới" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
