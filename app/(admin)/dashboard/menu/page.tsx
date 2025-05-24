"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuItem } from "@/types/MenuItem";
import {
  fetchMenus,
  addMenu,
  editMenu,
  deleteMenu,
} from "@/modules/admin/menuApi";
import "antd/dist/reset.css";
import TitlePageAdmin from "@/components/share/TitlePageAdmin";
import { DeleteIcon, EditIcon } from "@/components/icons/Icons";

// Hàm chuyển flat array sang tree
function buildMenuTree(data: MenuItem[], parent = 0): MenuItem[] {
  return data
    .filter((item) => item.parent === parent)
    .sort((a, b) => a.ordering - b.ordering)
    .map((item) => {
      const children = buildMenuTree(data, item.id);
      return {
        ...item,
        key: item.id,
        children: children.length > 0 ? children : undefined, // chỉ set children nếu có con
      };
    });
}

const columns = (
  onEdit: (record: MenuItem) => void,
  onDelete: (id: number) => void,
  onAddSub: (parent: MenuItem) => void
): ColumnsType<MenuItem> => [
  {
    title: "Menu",
    dataIndex: "name",
    key: "name",
    render: (text: string) => <span className="font-medium">{text}</span>,
  },
  {
    title: "Đường dẫn",
    dataIndex: "link",
    key: "link",
    render: (link: string) => (
      <a href={`/${link}`}  target="_blank" className="text-blue-600 underline uppercase">{link}</a>
    ),
  },
  {
    title: "Số thứ tự",
    // dataIndex: "ordering",
    // key: "ordering",
    width: 90,
    align: "center",
    render: (_, record) => (
      <span
        className={`border ${
          record?.parent === 0
            ? `border-violet-400 text-violet-500`
            : `border-red-400 text-red-500`
        }  rounded px-3 py-1 `}
      >
        {record?.ordering}
      </span>
    ),
  },

  {
    title: "Thao tác",
    key: "action",
    align: "center",
    width: 130,
    fixed: "right",
    render: (_, record) => {
      if (record?.name === "TRANG CHỦ") {
        // Không hiển thị gì nếu là "TRANG CHỦ"
        return null;
      }
      return (
        <div className="flex justify-center space-x-3">
          {record?.parent === 0 ? (
            <Button
              type="text"
              icon={
                <PlusCircleOutlined
                  style={{ fontSize: "17px", color: "#52c41a" }}
                />
              }
              title="Thêm menu con"
              //   onClick={() => onAddSub(record)}
              onClick={(e) => {
                e.stopPropagation(); // Ngăn mở tree khi click icon này
                onAddSub(record);
              }}
            />
          ) : (
            <div style={{ width: 20 }}></div>
          )}

          <Button
            type="text"
            icon={<EditIcon />}
            // onClick={() => onEdit(record)}
            onClick={(e) => {
              e.stopPropagation(); // Ngăn mở tree khi click icon này
              onEdit(record);
            }}
            title="Sửa menu"
          />
         
          <Popconfirm
            title={`Bạn có chắc muốn xóa menu "${record.name}"?`}
            onConfirm={(e) => {
              e?.stopPropagation(); // Ngăn sự kiện lan ra ngoài
              onDelete(record.id);
            }}
            onCancel={(e) => {
              e?.stopPropagation(); // Ngăn sự kiện lan ra ngoài
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              icon={<DeleteIcon className="text-red-500" />}
              title="Xóa menu"
              onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan ra ngoài khi bấm nút
            />
          </Popconfirm>
   
        </div>
      );
    },
  },
];

export default function MenuManager() {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [addSubForm] = Form.useForm();
  const [parentForSub, setParentForSub] = useState<MenuItem | null>(null);
  const [addSubModalOpen, setAddSubModalOpen] = useState(false);
  // Load menu
  const loadMenus = async () => {
    setLoading(true);
    try {
      const data = await fetchMenus();
      setMenuData(data.Data);
    } catch (e: any) {
      notification.error({ message: "Lỗi", description: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  // Thêm menu
  const handleAddSubMenu = async (values: any) => {
    if (!parentForSub) return;
    try {
      await addMenu({
        name: values.name,
        alias: values.name.toLowerCase().replace(/\s+/g, "-"),
        link: values.link,
        menutype: "mainmenu",
        parent: parentForSub.id, // Gán parent là id menu cha
        ordering: Number(values.ordering),
        published: 1,
      });
      notification.success({
        message: "Thành công",
        description: "Đã thêm menu con!",
      });
      setAddSubModalOpen(false);
      addSubForm.resetFields();
      setParentForSub(null);
      loadMenus();
    } catch (e: any) {
      notification.error({ message: "Lỗi", description: e.message });
    }
  };

  const handleAddMenu = async (values: any) => {
    try {
      await addMenu({
        name: values.name,
        alias: values.name.toLowerCase().replace(/\s+/g, "-"),
        link: values.link,
        menutype: "mainmenu",
        parent: 0, // Gán parent là id menu cha
        ordering: Number(values.ordering),
        published: 1,
      });
      notification.success({
        message: "Thành công",
        description: "Đã thêm menu con!",
      });
      setModalOpen(false);
      setAddSubModalOpen(false);
      addSubForm.resetFields();
      setParentForSub(null);
      loadMenus();
    } catch (e: any) {
      notification.error({ message: "Lỗi", description: e.message });
    }
  };

  // Mở popup sửa menu
  const openEditModal = (menu: MenuItem) => {
    // console.log(menu);
    setEditingMenu(menu);
    setParentForSub(menu);
    editForm.setFieldsValue({
      name: menu.name,
      link: menu.link,
      ordering: menu.ordering,
    });
    setEditModalOpen(true);
  };

  // Sửa menu
  const handleEditMenu = async (values: any) => {
    if (!editingMenu) return;
    try {
      await editMenu(editingMenu.id, {
        name: values.name,
        alias: values.name.toLowerCase().replace(/\s+/g, "-"),
        link: values.link,
        menutype: "mainmenu",
        parent: editingMenu?.parent,
        ordering: Number(values.ordering),
        published: 1,
      });
      notification.success({
        message: "Thành công",
        description: "Đã sửa menu!",
      });
      setEditModalOpen(false);
      setEditingMenu(null);
      editForm.resetFields();
      loadMenus();
    } catch (e: any) {
      notification.error({ message: "Lỗi", description: e.message });
    }
  };

  // Xóa menu
  const handleDeleteMenu = async (id: number) => {
    try {
      await deleteMenu(id);
      notification.success({
        message: "Thành công",
        description: "Đã xóa menu!",
      });
      loadMenus();
    } catch (e: any) {
      notification.error({ message: "Lỗi", description: e.message });
    }
  };

  const openAddSubModal = (parent: MenuItem) => {
    setParentForSub(parent);
    addSubForm.setFieldsValue({
      name: "",
      link: "",
      ordering: 1,
    });
    setAddSubModalOpen(true);
  };

  const rowClassName = (record: MenuItem) => {
    if (record.parent === 0) {
      return ""; // menu cha mặc định
    }
    // menu con cấp 1 (parent != 0)
    return "bg-gray-50"; // ví dụ màu nền sáng hơn
  };

  return (
    <div className="max-w-4xl pl-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          background: "white",
          padding: 8,
          borderRadius: 5,
        }}
      >
        <TitlePageAdmin text={"Quản lý menu"} />

        <Button
          // type="primary"
          icon={<PlusOutlined />}
          className="bg-[#7367F0] hover:bg-violet-600"
          onClick={() => {
               setTimeout(() => {
                form.resetFields(); // reset sau 100ms
              }, 100);
            setModalOpen(true)}}
          style={{ background: "#7367F0", color: "white" }}
        >
          Thêm mới
        </Button>
      </div>

      <Table<MenuItem>
        columns={columns(openEditModal, handleDeleteMenu, openAddSubModal)}
        dataSource={buildMenuTree(menuData)}
        pagination={false}
        expandable={{ expandRowByClick: true, indentSize: 24 }}
        loading={loading}
         scroll={{ y: 550 }} 
        style={{ width: 1200 }}
        // className="border rounded"
        rowClassName={rowClassName}
        className="[&_.ant-table-cell]:!p-2.5"
      />

      {/* Modal Thêm mới */}
      <Modal
        title="Thêm mới menu"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
        styles={{ body: { paddingBottom: 8, padding: 16 } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddMenu}
          initialValues={{ ordering: 1 }}
        >
          <Form.Item
            name="name"
            label="Tên menu"
            rules={[{ required: true, message: "Nhập tên menu!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="link"
            label="Đường dẫn"
            rules={[{ required: true, message: "Nhập đường dẫn!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ordering"
            label="Số thứ tự"
            rules={[{ required: true, message: "Nhập số thứ tự!" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <div className="flex justify-end space-x-2 mt-2 gap-2">
            <Button onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-violet-500 hover:bg-violet-600 ml-2"
            >
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal Sửa menu */}
      <Modal
        title="Sửa menu"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        destroyOnClose
        styles={{ body: { paddingBottom: 8, padding: 16 } }}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditMenu}>
          <Form.Item
            name="name"
            label="Tên menu"
            rules={[{ required: true, message: "Nhập tên menu!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="link"
            label="Đường dẫn"
            rules={[{ required: true, message: "Nhập đường dẫn!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ordering"
            label="Số thứ tự"
            rules={[{ required: true, message: "Nhập số thứ tự!" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <div className="flex justify-end space-x-2 mt-2 gap-2">
            <Button onClick={() => setEditModalOpen(false)}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-violet-500 hover:bg-violet-600 ml-2"
            >
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        title={
          parentForSub
            ? `Thêm menu con cho "${parentForSub.name}"`
            : "Thêm menu con"
        }
        open={addSubModalOpen}
        onCancel={() => setAddSubModalOpen(false)}
        footer={null}
        destroyOnClose
        styles={{ body: { paddingBottom: 8, padding: 16 } }}
      >
        <Form
          form={addSubForm}
          layout="vertical"
          onFinish={handleAddSubMenu}
          initialValues={{ ordering: 1 }}
        >
          <Form.Item
            name="name"
            label="Tên menu"
            rules={[{ required: true, message: "Nhập tên menu!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="link"
            label="Đường dẫn"
            rules={[{ required: true, message: "Nhập đường dẫn!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ordering"
            label="Số thứ tự"
            rules={[{ required: true, message: "Nhập số thứ tự!" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <div className="flex justify-end space-x-2 mt-2 gap-2">
            <Button onClick={() => setAddSubModalOpen(false)}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-violet-500 hover:bg-violet-600 ml-2"
            >
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
