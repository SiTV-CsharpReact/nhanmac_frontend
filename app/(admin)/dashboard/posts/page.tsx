"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Tooltip,
  Spin,
  Select,
} from "antd";
import Image from "next/image";
import TitlePageAdmin from "@/components/share/TitlePageAdmin";
import { Post } from "@/types/contentItem";
import {
  fetchPost,
  updateSlideOrder,
  updateContent,
  fetchSearchContents,
  fetchContentShortId,
} from "@/modules/admin/slideApi";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import toast from "react-hot-toast";
import { EditIcon } from "@/components/icons/Icons";
import dayjs from "dayjs";
import { UploadOutlined, EyeOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

import debounce from "lodash/debounce";
import { renderUrl } from "@/utils/util";
interface SortableRowProps {
  id: string;
  children: React.ReactNode;
}

function SortableRow({ id, children }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isDragging ? "#fafafa" : undefined,
    boxShadow: isDragging ? "0 4px 8px rgba(0,0,0,0.15)" : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      // Không gán listeners cho toàn bộ <tr> để tránh chặn click các nút
      // listeners sẽ được gán riêng cho cột handle bên dưới
    >
      {React.Children.map(children, (child, index) => {
        if (index === 0) {
          // Gán listeners và style cursor cho cột handle (cột kéo thả)
          return React.cloneElement(child as React.ReactElement, {
            ...listeners,
            style: {
              cursor: "grab",
              userSelect: "none",
              ...child.props.style,
            },
          });
        }
        return child;
      })}
    </tr>
  );
}
const { Option } = Select;
const AdminPostManagement: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Post | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fetching, setFetching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState<Post[]>([]);
  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [formData, setFormData] = useState<Post | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchPost();
      if (response.Code === 200 && response.Data) {
        setPosts(response?.Data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("Fetching...");
    fetchData();
  }, []);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = posts.findIndex(
        (item) => String(item.id) === String(active.id)
      );
      const newIndex = posts.findIndex(
        (item) => String(item.id) === String(over.id)
      );
      const newItems = arrayMove(posts, oldIndex, newIndex);
      setPosts(newItems);
      toast.success("Sắp xếp thành công!");
    }
  };

  // Debounce để tránh gọi API quá nhiều lần khi gõ
  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value: string) => {
      setSearchText(value);
      fetchSearchContent(value).then((res) => {
        setOptions(res);
      });
    };

    return debounce(loadOptions, 500);
  }, []);

  const handleSaveOrder = async () => {
    setLoading(true);
    try {
      const orderedIds = posts.map((post) => post.id);
      const response = await updateSlideOrder(orderedIds);
      if (response.Code === 200) {
        toast.success("Lưu thứ tự thành công!");
        fetchData();
      } else {
        toast.error("Lỗi khi lưu thứ tự: " + response.Message);
      }
    } catch (error: any) {
      console.error("Lỗi khi gọi API lưu thứ tự:", error);
      toast.error("Lỗi khi lưu thứ tự: " + error.message);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
    setEditingRecord(null);
  };
  const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: rowId });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: "grab",
      padding: "0 8px",
      fontSize: 18,
      lineHeight: 1,
      backgroundColor: isDragging ? "#f5f5f5" : undefined,
    };

    return (
      <Tooltip title="Giữ chuột kéo thả">
        <span
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={style}
          title="Kéo thả để sắp xếp"
        >
          &#8942;&#8942;
        </span>
      </Tooltip>
    );
  };

  // Hàm gọi API tìm kiếm (gọi hàm fetchSearchContents đã định nghĩa ở nơi khác)
  const fetchSearchContent = async (query: string): Promise<Post[]> => {
    if (!query) return [];

    setFetching(true);
    try {
      const response = await fetchSearchContents(query);
      if (response.Code === 200) {
        return response.Data;
      }

      return [];
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setFetching(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!editingRecord) return;

      const formData = {
        article_id:values.articleID,
      };

      const response = await updateContent(editingRecord.ordering, formData);
      if (response.Code === 200) {
        message.success("Cập nhật thành công!");
        handleCancel();
        fetchData();
      } else {
        message.error(response.Message || "Cập nhật thất bại!");
      }
    } catch (error: any) {
      console.error("Lỗi khi cập nhật:", error);
      message.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

  const columns = [
    {
      title: "Sắp xếp",
      dataIndex: "sort",
      width: 80,
      align: "center",
      render: (_: any, record: Post) => (
        <RowDragHandleCell rowId={record.id.toString()} />
      ),
    },
    { title: "STT", dataIndex: "ordering", width: 60 },
    { title: "ID bài viết", dataIndex: "id", key: "id", width: 100 },
    { title: "Tiêu đề", dataIndex: "title", key: "title", ellipsis: true },
    {
      title: "Thao tác",
      key: "action",
      width: 88,
      align: "center",
      render: (_: any, record: Post) => (
        <div className="flex justify-center">
          <Button
            type="text"
            icon={<EditIcon />}
            onClick={(e) => {
              setTimeout(() => {
                form.resetFields(); // reset sau 100ms
              }, 100);
              form.setFieldValue("articleID", "");
              setOptions([]);
              setFormData(null);
              e.stopPropagation(); // Ngăn kéo thả khi click nút
              setIsModalOpen(true);
              setEditingRecord(record)
            }}
            title="Sửa menu"
          />
        </div>
      ),
    },
  ];

  // Wrapper tbody với SortableContext
  const DraggableContainer = (props: any) => (
    <SortableContext
      items={posts.map((item) => String(item.id))}
      strategy={verticalListSortingStrategy}
    >
      <tbody {...props} />
    </SortableContext>
  );

  // Wrapper row dùng useSortable
  const DraggableBodyRow = (props: any) => {
    const { "data-row-key": rowKey, children } = props;
    return <SortableRow id={String(rowKey)}>{children}</SortableRow>;
  };

  const onSelect = async (value: number) => {
    const id = Number(value);
    setFetchingDetail(true);
    try {
      const detail = await fetchContentShortId(id);
      // console.log(`${env.hostBackend}${detail.Data.urls}`);
      setFormData(detail.Data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết bài viết", error);
      setFormData(null);
    } finally {
      setFetchingDetail(false);
    }
  };

  return (
    <div className="px-3">
      <div className="p-2 bg-white rounded flex justify-between items-center">
        <TitlePageAdmin text={"Quản lý slide"} />
        <Button
          type="primary"
          onClick={handleSaveOrder}
          loading={loading}
          className="!bg-[#2f80ed]"
        >
          Lưu thứ tự
        </Button>
      </div>
      <Spin spinning={loading}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table
            // className="mt-3"
            rowKey="id"
            columns={columns}
            dataSource={posts}
            // loading={loading}
            pagination={false}
            scroll={{ x: true }}
            className="mt-3 [&_.ant-table-cell]:!p-2"
            components={{
              body: {
                wrapper: DraggableContainer,
                row: DraggableBodyRow,
              },
            }}
          />
        </DndContext>
      </Spin>
      <Modal
        title={`Chọn bài viết muốn thay đổi cho "${editingRecord?.title}"`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !formData }}
        width={800}
        styles={{
          body: { paddingBottom: 8, padding: 16 },
          footer: { padding: 16 },
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Tìm kiếm bài viết" name="articleID">
            <Select
              showSearch
              style={{ width: 300 }}
              placeholder="Tìm kiếm bài viết"
              filterOption={false} // tắt filter client để dùng server search
              onSearch={debounceFetcher}
              notFoundContent={fetching ? <Spin size="small" /> : null}
              onChange={(value) => onSelect(Number(value))}
              optionLabelProp="label"
            >
              {options.map((post) => (
                <Option
                  key={post.id}
                  value={post.id}
                  label={post.title}
                >
                  {post.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {formData && (
            <>
              <Form.Item label="ID bài viết">
                <Input value={formData.id} readOnly disabled />
              </Form.Item>
              <Form.Item label="Tiêu đề">
                <Input value={formData.title} readOnly disabled />
              </Form.Item>
              <Form.Item label="Ảnh">
                {/* <Image src={`${env.hostBackend}${formData.urls}`} width={200} height={200} alt={formData.title}/> */}

                {formData.urls && (
                  // console.log(formData.urls),
                  <div className="relative w-50 h-25 cursor-pointer overflow-hidden rounded group">
                    <Image
                      src={renderUrl(formData.urls)}
                      alt="Ảnh"
                      width={200}
                      height={100}
                      className="object-cover"
                    />
                    <EyeOutlined
                      onClick={() => {
                        setPreviewImage(renderUrl(formData.urls));
                        // src={renderUrl(label.urls)}
                        setPreviewTitle(formData.title || "Xem ảnh");
                        setPreviewOpen(true);
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
               text-white text-2xl opacity-0 group-hover:opacity-100 
               transition-opacity duration-300 hover:text-blue-400"
                      style={{ zIndex: 10, color: "white" }}
                    />
                  </div>
                )}
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        styles={{ body: { paddingBottom: 8, padding: 16 } }}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default AdminPostManagement;
