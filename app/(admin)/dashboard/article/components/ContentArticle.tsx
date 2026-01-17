"use client";
import React, { memo, useEffect, useState } from "react";
// import { Button, Form, Space } from "antd";
import TextEditor from "@/components/plugin/TextEditor";
import MetadataForm from "./MetadataForm";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Space,
  Typography,
  Image,
  Tag,
  Col,
  Row,
  Spin,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import PublishInfoForm from "./PublishInfoForm";
import { Post } from "@/types/contentItem";
import { getBase64, removeVietnameseTones } from "../../../../../utils/util";
import { env } from "../../../../../config/env";
import { createContent, updateContent } from "../../../../../modules/admin/contentApi";
import dayjs from "dayjs";

const { TextArea } = Input;
interface StatusModal {
  idContent?: number | undefined;
  openModal: boolean;
  typeModal: number | undefined;
}


interface typeContentArticle {
  typeModal: number | undefined;
  data: Post;
  reset?: boolean;
  setTypeModal: (modal: StatusModal) => void;
  setOnReload: () => void;
}

const ContentArticle: React.FC<typeContentArticle> = ({
  typeModal,
  setTypeModal,
  setOnReload,
  data,
  reset,
}) => {
  // console.log(data)
  const [editorData, setEditorData] = useState("");
  const [content, setContent] = useState("");
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isUpload, setIsUpload] = useState(false);
  const [urlFile, setUrlFile] = useState<any>({});
  const [typeSub, setTypeSub] = useState(0);
  const [alias, setAlias] = useState("");
  const [title, setTitle] = useState("");
  const [loadingAlias, setLoadingAlias] = useState(false);

  // Reset form khi modal mở
  useEffect(() => {
    if (reset) {
      form.resetFields();
      setEditorData("");
      setContent("");
      setImageUrl(null);
      setFileList([]);
      setIsUpload(false);
      setUrlFile({});
    }
  }, [reset, form]);

  // Props cho Upload

  // Hiển thị ảnh
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    const url = file.url as string;
    const preview = file.preview as string;
    setPreviewImage(url || preview || "");
    setPreviewOpen(true);
  };

  // Hàm upload ảnh

  // const uploadProps = {
  //   name: "file",
  //   action: env.uploadUrl,
  //   accept: "image/*",
  //   listType: "picture",
  //   beforeUpload: (file: File) => {
  //     setIsUpload(true);
  //     // const type = getExtension(file.name);
  //     // if (fileType[type] === undefined) {
  //     //   setFileList((state) => [...state]);
  //     //   message.error(`${file.name} không đúng định dạng`);
  //     //   setIsUpload(false);
  //     //   return false;
  //     // } else

  //     if (file.size / (1024 * 1024) > 5) {
  //       setFileList((state) => [...state]);
  //       message.error("Ảnh vượt quá dung lượng cho phép (5Mb)");
  //       setIsUpload(false);
  //       return false;
  //     } else {
  //       setFileList((state) => [...state, file]);
  //       return true;
  //     }
  //   },
  //   onRemove: (file: File) => {
  //     if (fileList.some((item) => item.uid === file?.uid)) {
  //       setFileList((fileList) =>
  //         fileList.filter((item) => item.uid !== file.uid)
  //       );
  //       setUrlFile({});
  //       setIsUpload(false);
  //       setImageUrl(null);
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   },
  //   onChange(info) {
  //     if (info.file.status === "done" && info?.file?.response != "") {
  //       setFileList(info.fileList);
  //       setUrlFile({
  //         pictureName: info?.file?.name,
  //         pictureUrl: info?.file?.response?.Data?.imageUrl,
  //       });
  //       setIsUpload(true);
  //     }

  //     if (info.file.status === "error") {
  //       message.error(
  //         `${info.file.name} upload không thành công bạn hãy thử lại`
  //       );
  //       setFileList((fileList) =>
  //         fileList.filter((item) => item.uid !== info.file.uid)
  //       );
  //       setIsUpload(false);
  //     }
  //   },
  //   fileList,
  // };
  const uploadProps = {
    name: "file",
    action: env.uploadUrl,
    accept: "image/*",
    listType: "picture",
    beforeUpload: (file: File, fileList: UploadFile[]) => {
      setIsUpload(true);
      if (file.size / (1024 * 1024) > 5) {
        message.error("Ảnh vượt quá dung lượng cho phép (5Mb)");
        setIsUpload(false);
        return false;
      }
      // Không add manual ở đây nữa, để onChange xử lý
      return true;
    },
    onChange: (info:any) => {
      const { file, fileList: newFileList } = info;
      setFileList(newFileList);
  
      if (file.status === "done" && file?.response != "") {
        setUrlFile({
          pictureName: file?.name,
          pictureUrl: file?.response?.Data?.imageUrl,
        });
      } else if (file.status === "error") {
        message.error(`${file.name} upload không thành công bạn hãy thử lại`);
        setIsUpload(false);
      } else if (file.status === "uploading") {
        setIsUpload(true);
      }
    },
    onRemove: (file: UploadFile) => {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      setUrlFile({});
      setIsUpload(false);
      setImageUrl(null);
      return true;
    },
    fileList,
  };
  

  const reloadPage = () => {
    setTypeModal({
      // idContent: record?.id,
      typeModal: 4,
      openModal: false,
    })
    form.resetFields();
    setEditorData("");
    setImageUrl(null);
    setFileList([]);
    setUrlFile({});
    setOnReload();
  }
  // Submit form
  const onFinish = async (values: any) => {
    try {
      const formData = {
        ...values,
        state: typeSub,
        picture: '',
        introtext: editorData,
        created: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        title_alias: "test",
        urls: urlFile?.pictureUrl,
        images: urlFile?.pictureName
      };

      if (typeModal === 1) {
        // Tạo mới
        const response = await createContent(formData);
        if (response.Code === 200) {
          message.success(response.Message || "Tạo bài viết thành công!");
          reloadPage()
        } else {
          message.error(response.Message || "Tạo bài viết thất bại!");
        }
      } else {
        // console.log(data?.id)
        // Cập nhật
        const response = await updateContent(data?.id, formData);
        if (response.Code === 200) {
          message.success("Cập nhật bài viết thành công!");
          reloadPage();
        } else {
          message.error(response.Message || "Cập nhật bài viết thất bại!");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Có lỗi xảy ra khi xử lý bài viết!");
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data.title,
        // description: data.description,
        image_desc: data.image_desc,
        content: data.introtext,
        catid: data.catid,
        publish_up: data.publish_up ? dayjs(data.publish_up) : null,
        metakey: data.metakey,
        metadesc: data.metadesc,
        sectionid: data.sectionid,
        alias: data.alias,
      });
      setAlias(data.alias);
      setEditorData(data.introtext || "");
      setContent(data.introtext || "");
      setImageUrl(data?.urls);
      setIsUpload(false);
      setUrlFile({});
      data?.urls && setFileList([
        {
          uid: '-1', // Thêm một uid tạm thời
          name: data?.images, // Tên tạm thời của ảnh
          status: 'done', // Đặt trạng thái là đã hoàn thành để hiển thị hình ảnh
          url: data?.urls, // Sử dụng đường dẫn ảnh từ API
        }
      ]);
      setUrlFile({
        pictureName: data?.images,
        pictureUrl: data?.urls,
      });
      // setIsUpload(true);
    }
  }, [data, form]);

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
  useEffect(()=>{
    typeModal==1 && setAlias('')
  },[typeModal])
  return (
    <div className="px-4 py-2 w-full">
      {/* Header */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="[&_.ant-form-item]:!mb-[10px]"
      >
        {/* Nội dung 2 cột */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            width: "100%",
            // border:'1px solid #131313'
          }}
        >
          {/* Editor bên trái */}
          <div
            style={{
              flex: 2,
              minWidth: 0,
              border: "1px solid #d9d9d9",
              borderRadius: 8,
              padding: 16,
              paddingBottom: 5,
              boxShadow: "0 2px 8px #f0f1f2",
            }}
          >
            <div
              style={{
                background: "#eaf6ff",
                padding: 12,
                borderRadius: 4,
                marginBottom: 10,
              }}
            >
              <Space>
                <Typography.Text strong>
                  Công ty Cổ phần công nghệ Thiên Lương
                </Typography.Text>
                {typeModal == 2 &&
                  <Tag
                    color={data?.state == 1 ? "green" : "orange"}
                    className="pl-3"
                  >
                    {data?.state == 1 ? `Đã xuất bản` : `Chưa xuất bản`}
                  </Tag>}
              </Space>
            </div>

            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Nhập tiêu đề!" }]}
            >
              <TextArea rows={2} placeholder="Nhập tiêu đề bài viết" value={title}
                onChange={(e) => setTitle(e.target.value)} />
            </Form.Item>

            <Form.Item
              name="picture"
              label=""
              colon={false}
              style={{ marginBottom: 0 }}
            >
              <Upload {...uploadProps} onPreview={handlePreview}>
                {!imageUrl && (
                  <Button
                    style={{ display: "flex", alignItems: "center" }}
                    icon={<UploadOutlined />}
                    disabled={isUpload}
                  >
                    Tải ảnh lên
                  </Button>
                )}
              </Upload>
            </Form.Item>
            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Mô tả ảnh (không nhập sẽ auto lấy phần tiêu đề)" name="image_desc">
                  <Input placeholder="Mô tả ảnh minh họa" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Alias" name="alias">
                  <Spin spinning={loadingAlias} size="small">
                    <Input placeholder="alias" value={alias} readOnly />
                  </Spin>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Nội dung"
              name="content"
            >
              <TextEditor
                content={content}
                editorData={editorData}
                setEditorData={setEditorData}
                toolbar="full"
              />
            </Form.Item>

            <Form.Item >
              <Button type="primary" htmlType="submit" onClick={() => setTypeSub(1)}>
                {typeModal === 1 ? "Xuất bản" : "Cập nhật bài viết"}
              </Button>
              <Button type="default" htmlType="submit" className="!ml-3" onClick={() => setTypeSub(0)}>
               Chưa xuất bản
              </Button>
            </Form.Item>

          </div>
          {/* Metadata bên phải */}
          {typeModal !== 0 && (
            <div style={{ flex: 1, minWidth: 300, maxWidth: 350 }}>
              <PublishInfoForm form={form} />
              <MetadataForm />
            </div>
          )}
        </div>

      </Form>
    </div>
  );
};

export default memo(ContentArticle);

