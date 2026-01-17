"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Select, Dropdown, Menu, message, Form, Tooltip, Popconfirm, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { categoryApi } from '@/modules/admin/categoryApi';
import { Categories, Category } from "@/types/categoryItem";
import TitlePageAdmin from "@/components/share/TitlePageAdmin";
import { DeleteIcon, EditIcon } from "@/components/icons/Icons";
import { useCategories } from "@/hooks/useCategories";
const { Option } = Select;

import { removeVietnameseTones } from "../../../../utils/util";
// console.log(React.version);
// Hàm chuyển mảng phẳng thành tree

function buildTree(data: Categories[]): any[] {
  const sectionMap = new Map<number, any>();

  data.forEach(item => {
    // Nếu là mục Section (cha)
    if (!sectionMap.has(item.section_id)) {
      sectionMap.set(item.section_id, {
        key: `section-${item.section_id}`,
        id: `${item.section_id}`,
        title: item.section_title,
        alias: item.alias_parent,
        published: 1,
        parent_id: 0,
        children: [],
      });
    }

    // Nếu là category, push vào đúng section
    if (item.category_id) {
      sectionMap.get(item.section_id).children.push({
        key: `category-${item.category_id}`,
        id: item.category_id,
        title: item.category_title,
        alias: item.alias,
        published: 1,
        parent_id: item.parent_id,
      });
    }
  });

  return Array.from(sectionMap.values());
}

export default function CategoryTable() {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loadingPage,setLoadingPage] = useState(false);
  const [form] = Form.useForm();
  const { selectOptions, loading } = useCategories();
  const [alias, setAlias] = useState("");
  const [title, setTitle] = useState("");
  const [loadingAlias, setLoadingAlias] = useState(false);
  const [sttCategory, setSttCategory] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingPage(true);
    try {
      const data = await categoryApi.getAllSection();
      setCategories(data?.Data);
    } catch (error: any) {
      message.error(error.message || "Lỗi tải danh mục");
    } finally {
      setLoadingPage(false);
    }
  };
  const showModal = async (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      const type = category?.children ? 0 : 1;
      setSttCategory(category?.children ? 0 : 1)
      const data = await categoryApi.getDetail(category?.id, type);

      const res = data.Data
      setAlias(res.alias)
      setTimeout(() => form.setFieldsValue({
        name: res.name,
        title: res.title,
        alias: res.alias,
        section: Number(res.section),
        published: res.published,
      }))

    } else {
      setSttCategory(1)
      setEditingCategory(null);
      setTimeout(() => {
        setAlias("");
        form.resetFields(),
        form.setFieldsValue({
          section: '',
          published: 1
        })
      }

        , 200);

    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const categoryData = {
        name: values.name,
        title: values.title,
        alias: values.alias || removeVietnameseTones(values.title),
        section: values.section|| 0,
        published: values.published,
      };
      // console.log(editingCategory?.id)

      if (editingCategory) {
        await categoryApi.update(editingCategory.id, values?.section ? 1 : 0, categoryData);
        message.success("Chuyên mục đã được cập nhật");
      } else {
        const res = await categoryApi.create(categoryData);
        message.success(res.Message);
      }

      fetchCategories();
      setIsModalOpen(false);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleDelete = async (id: number, type: number) => {
    try {
      await categoryApi.delete(id, type);
      fetchCategories();
      message.success("Chuyên mục đã được xóa");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (!title) {
      setAlias("");
      form.setFieldsValue({ alias: "" });
      return;
    }

    setLoadingAlias(true);
    const handler = setTimeout(() => {
      const converted = removeVietnameseTones(title);
      setAlias(converted);
      form.setFieldsValue({ alias: converted });
      setLoadingAlias(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [title, form]);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", align: 'center', width: 100, },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Alias", dataIndex: "alias", key: "alias" },
    {
      title: "Trạng thái",
      dataIndex: "published",
      key: "published",
      render: (published: number) => (published === 1 ? "Đã xuất bản" : "Chưa xuất bản"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 80,
      render: (_: any, record: Category) => (
        // console.log(_),
        <div className="flex gap-5">
          <div className="pt-1" onClick={(e) => {
            e?.stopPropagation();
            showModal(record)
          }}>
            <EditIcon
            />
          </div>
          {!_.children &&<Tooltip title="Xóa">
            <Popconfirm
              title={`Bạn có chắc muốn xóa "${record.title}"?`}
              onConfirm={(e) => {
                e?.stopPropagation(); // Ngăn sự kiện lan ra ngoài
                handleDelete(record.id, record?.children ? 0 : 1);
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
          </Tooltip>}
          
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loadingPage}>
    <div className="pl-4">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, background: 'white', padding: 6, borderRadius: 5 }}>
        <TitlePageAdmin text={'Quản lý chuyên mục'} />

        <Button
          // type="primary"
          icon={<PlusOutlined />}
          className="bg-[#7367F0] hover:bg-violet-600"
          onClick={() => showModal()}
          style={{ background: '#7367F0', color: 'white' }}
        >
          Thêm mới
        </Button>
      </div>

      <Table
        style={{
          width: 900,
          marginTop: 20
        }}
        columns={columns}
        dataSource={buildTree(categories)}
        pagination={false}
        expandable={{ expandRowByClick: true, indentSize: 24, }}
        bordered
        // rowClassName={rowClassName}
        className="[&_.ant-table-cell]:!p-2"
      />

      <Modal
        title={
          <div style={{ textAlign: "center", fontWeight: 600 }}>
            {editingCategory ? "Chỉnh sửa chuyên mục" : "Thêm mới chuyên mục"}
          </div>
        }
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
        styles={{ body: { paddingBottom: 8, padding: 16 } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên chuyên mục"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề chuyên mục" }]}
          >
            <Input
              placeholder="Tiêu đề"
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Alias" name="alias">
            <Spin spinning={loadingAlias} size="small">
              <Input placeholder="Alias (để trống sẽ tự động tạo)" value={alias} readOnly />
            </Spin>
          </Form.Item>
          {sttCategory == 1 &&
            <Form.Item label="Danh mục cha" name="section">
              <Select
                allowClear
                options={selectOptions.slice(1)}
                placeholder="-- Chọn danh mục cha --"
              />
            </Form.Item>
          }


          <Form.Item label="Trạng thái xuất bản" name="published">
            <Select>
              <Option value={1}>Đã xuất bản</Option>
              <Option value={0}>Chưa xuất bản</Option>
            </Select>
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <Button
              onClick={handleSave}
              type="primary"
              style={{ borderRadius: 6, minWidth: 80 }}
            >
              Lưu
            </Button>
            <Button
              onClick={() => setIsModalOpen(false)}
              danger
              style={{ borderRadius: 6, minWidth: 80 }}
            >
              Hủy
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
    </Spin>
  );
}
