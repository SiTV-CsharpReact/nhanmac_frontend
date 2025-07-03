"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Tooltip, Form, Modal, notification, Space, Popconfirm,Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { dateFormat, statusXB } from "../../../../config/config";
import { formatMoney, getConstantLabel, getTagColor } from "../../../../utils/util";
import dayjs from 'dayjs';
// import { FileSearchOutlined, PlusCircleOutlined } from "ant-design/icons";
import { DeleteIcon, EditIcon } from "@/components/icons/Icons";
import SearchComponent from "./components/SearchComponent";
import { deleteContent, fetchContent, fetchContentId } from "../../../../modules/admin/contentApi";
import { Post } from "@/types/contentItem";
import CustomModal from "@/components/share/CustomModal";
import ContentArticle from "./components/ContentArticle";
import ViewArticle from "./components/ViewArticle";
import TitlePageAdmin from "@/components/share/TitlePageAdmin";
import type { TablePaginationConfig } from "antd/es/table";

import { env } from "../../../../config/env";
import { FileSearchOutlined, PlusCircleOutlined } from "@ant-design/icons/lib/icons";
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
}
const { Text } = Typography;
interface TableItem extends Post {
  key: number;
}

const initialParams = {
  created: [dayjs().subtract(3, "month"), dayjs()], // ví dụ 'YYYY-MM-DD'
  pageNumber: 1,
  pageSize: 10,
  sectionid: undefined,
  keySearch: undefined,
};
interface StatusModal {
  idContent?: number | undefined;
  openModal: boolean;
  typeModal: number | undefined;
}

const defaultPagin = {
  current: 1,
  pageSize: 10,
  total: 0,
}
interface EllipsisWithTooltipProps {
  text: React.ReactNode;
  maxWidth?: number; // tùy chọn giới hạn chiều rộng
}

const EllipsisWithTooltip: React.FC<EllipsisWithTooltipProps> = ({
  text,
  maxWidth = 380,
}) => {
  const [isEllipsis, setIsEllipsis] = useState(false);

  return (
    <Tooltip title={isEllipsis ? (typeof text === "string" ? text : undefined) : ""}>
      <Text
        ellipsis={{
          tooltip: false,
          onEllipsis: (ellipsis) => {
            setIsEllipsis(ellipsis);
          },
        }}
        style={{ maxWidth, display: "block" }}
      >
        {text}
      </Text>
    </Tooltip>
  );
};

// export default EllipsisWithTooltip;

const Page: React.FC = () => {
  const [data, setData] = useState<TableItem[]>([]);
  const [dataDetail, setDataDetail] = useState<Post>();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const [onReload, setOnReload] = useState(false);
  const [fixedParams, setFixedParams] = useState(initialParams);
  const [onResetFilter, setOnResetFilter] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [isSttModal, setIsSttModal] = useState<StatusModal>();
  const [pagination, setPagination] = useState(defaultPagin);
  const [resetForm, setResetForm] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  // Reset form khi mở modal
  useEffect(() => {
    if (isSttModal?.openModal) {
      setResetForm(true);
      setTimeout(() => setResetForm(false), 100);
    }
  }, [isSttModal?.openModal]);

  // Hàm fetch dữ liệu bằng fetch API
  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    const values = await form.validateFields();
    const { created, state, sectionid, keyword } = values;
  
    try {
      const response = await fetchContent({
        startTime: created[0].format(dateFormat),
        endTime: created[1].format(dateFormat),
        page: page,             // ✅ KHÔNG -1
        pageSize: pageSize,
        state,
        sectionid,
        keyword,
      });
  
      if (response.Code === 200 && response.Data) {
        const rawData = Array.isArray(response.Data.list) ? response.Data.list : [];
  
        setData(
          rawData.map((item) => ({ ...item, key: item.id }))
        );
        setTotalPage(response.Data?.total);
        // ✅ cập nhật lại phân trang
        setPagination({
          current: page,
          pageSize: pageSize,
          total: response.Data?.total, // <-- cập nhật lại total cho Table
        });
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  
    setLoading(false);
  };
  

  // Hàm lấy chi tiết bài viết
  const fetchDetail = async (id: number) => {
    try {
      const result = await fetchContentId(id);
      if (result.Code === 200) {
        setDataDetail(result.Data);

      }
    } catch (error) {
      // Error đã được xử lý trong API
    }
  };

  // Hàm xóa bài viết
  const handleDeleteContent = async (id: number) => {
    try {
      const result = await deleteContent(id);
      if (result.Code === 200) {
        notification.success({
          message: "Thành công",
          description: "Đã xóa bài viết thành công!",
        });
      
      }
      setOnReload(true); // Refresh lại danh sách sau khi xóa
    } catch (error) {
      // Error đã được xử lý trong API
    }
  };

  useEffect(() => {
    fetchData();
  }, [onReload]);

  useEffect(() => {
    // Chỉ gọi API khi typeModal là 2 (chỉnh sửa) và có idContent
    if (
      isSttModal?.openModal &&
      isSttModal?.idContent &&
      (isSttModal?.typeModal === 0 || isSttModal?.typeModal === 2)
    ) {
      fetchDetail(isSttModal.idContent);
    }
  }, [isSttModal?.openModal, isSttModal?.idContent, isSttModal?.typeModal]);

  const columns: ColumnsType<TableItem> = [
    {
      title: "#",
      dataIndex: "id",
      align:'center',
      width: 50
    },
    {

      title: "Trạng thái",
      dataIndex: "state",
      width: 80,
      render: (text: string) => {
        return (
          <Tag color={getTagColor(statusXB, text)}>
            {getConstantLabel(statusXB, text)}
          </Tag>
        );
        // return <span className="font-semibold">{getConstantLabel(statusXB, text)}</span>;
      },
    },
    {
      title: "Ngày xuất bản",
      dataIndex: "created",
      render: (text) => (
        <span className="font-semibold">
          {dayjs(text).format("DD/MM/YYYY")}
        </span>
      ),
      width: 125
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 330, // đặt width cố định để ellipsis hoạt động tốt
      render: (text: string) => <EllipsisWithTooltip text={text} />,
    },
    {
      title: "Alias",
      dataIndex: "alias",
      key: "alias",
      width: 250, // đặt width cố định để ellipsis hoạt động tốt
      render: (text: string) => <EllipsisWithTooltip text={text} maxWidth={250}/>,
    },
    {
      title: "Link bài viết",
      // key: "alias",
      width:280, // đặt width cố định để ellipsis hoạt động tốt
      render: (text, record) => (
      
        <EllipsisWithTooltip
          text={
            <a href={`${env.host}${record.alias}-${record.id}.html`} target="_blank" rel="noopener noreferrer">
              {`${record.alias}-${record.id}.html`}
            </a>
          }
          maxWidth={280}
        />
      ),
    },
    {
      title: "Thao tác",
      width: 70,
      // fixed:'right',
      render: (_, record) => (
        <div className="flex gap-3 cursor-pointer">
          <Tooltip title="Xem">
            <FileSearchOutlined
              style={{ fontSize: 18 }}
              onClick={() =>
                setIsSttModal({
                  idContent: record?.id,
                  typeModal: 0,
                  openModal: true,
                })
              }
            />
          </Tooltip>
          <div
          className="pt-1.5"
          onClick={() =>
            setIsSttModal({
              idContent: record?.id,
              typeModal: 2,
              openModal: true,
            })
          }>
            <EditIcon
            />
          </div>
          <Tooltip title="Xóa">
        <Popconfirm
            title={`Bạn có chắc muốn xóa "${record.title}"?`}
            onConfirm={() => {
              handleDeleteContent(record.id);
            }}

            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
            className="!pt-1"
              type="text"
              icon={<DeleteIcon className="text-red-500" />}
              title="Xóa menu"
              onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan ra ngoài khi bấm nút
            />
          </Popconfirm>
          </Tooltip>
     
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const current = pagination.current || 1;
    const pageSize = pagination.pageSize || 10;
  
    setTableParams({ pagination });        // cập nhật local
    setPagination({ current, pageSize, total: pagination.total || 0 }); // cập nhật pagination nếu cần
  
    fetchData(current, pageSize);          // ✅ gọi API lại với pageSize mới
  };

  return (
    <div className="mx-4  w-full">
      <div className="bg-white pt-2 rounded">
        <TitlePageAdmin text={'Quản lý bài viết'} />
        <SearchComponent
          setOnReload={() => setOnReload(prev => !prev)}
          form={form}
          setFixedParams={setFixedParams}
          productTypeOptions={statusXB}
          // showType={false}
          setOnResetFilter={setOnResetFilter}
        />
      </div>

      <div className="mt-5 bg-white rounded">
        <div className="flex justify-between pt-4 px-4">
          <div className="flex gap-2 text-muted">
            <div>
              Tổng bài viết:{" "}
              <span className="text-success text-[#00b350] font-semibold text-italic">{formatMoney(totalPage, "")}</span>
            </div>
            {/* <div>Tổng bài viết chưa duyệt: </div> */}
          </div>
          <div className="pb-2">
            <Button icon={<PlusCircleOutlined />} onClick={() => setIsSttModal({ typeModal: 1, openModal: true })}>
              Tạo mới
            </Button>

          </div>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            ...pagination,
            showTotal: (total, range) => {
              const rangeNumber = range[1] - range[0] + 1;
              return `Hiển thị ${rangeNumber} trên ${total} kết quả`;
            },
            showSizeChanger: true,
          }}
          // scroll={{ x: 'max-content'  }} 
          loading={loading}
          onChange={handleTableChange}
          rowKey="id"
          // className="px-4"
          className="[&_.ant-table-cell]:!p-2.5 px-4"
        />
        <CustomModal
          header={`${isSttModal?.typeModal == 0 ? `Chi tiết` : isSttModal?.typeModal == 1 ? `Thêm mới` : `Chỉnh sửa`
            } bài viết`}
          onCancel={() => setIsSttModal({ typeModal: 0, openModal: false })} // Xử lý đóng modal
          open={isSttModal?.openModal}
          width={1200}
          children={
            <>
              {isSttModal?.typeModal === 0 ? (
                <ViewArticle data={dataDetail?.introtext} />
              ) : (
                <ContentArticle
                  typeModal={isSttModal?.typeModal}
                  setTypeModal={setIsSttModal}
                  data={dataDetail}
                  reset={resetForm}
                  setOnReload={() => setOnReload(prev => !prev)}
                />
              )}
            </>
          }
        ></CustomModal>
      </div>
    </div>
  );
};

export default Page;


