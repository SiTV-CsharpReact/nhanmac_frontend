"use client";
import React, { memo, useEffect, useState } from "react";
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
import { ReloadOutlined, UploadOutlined } from "@ant-design/icons";
import PublishInfoForm from "./PublishInfoForm";
import { Post } from "@/types/contentItem";
import { getBase64, removeVietnameseTones } from "../../../../../utils/util";
import { env } from "../../../../../config/env";
import { createContent, updateContent } from "../../../../../modules/admin/contentApi";
import dayjs from "dayjs";
import FileManager from "@/components/plugin/FileManager/FileManager";

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
  const [editorData, setEditorData] = useState(""); // ← Editor content
  const [content, setContent] = useState("");       // ← Initial content
  const [introtext, setIntrotext] = useState("");   // ✅ THÊM: Sync với form
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
  const [showFileManagerCover, setShowFileManagerCover] = useState(false);
  const [coverImage, setCoverImage] = useState(null); // {url, name}


  // Reset form khi modal mở
  useEffect(() => {
    if (reset) {
      form.resetFields();
      setEditorData("");
      setContent("");
      setIntrotext(""); // ✅ Reset introtext
      setImageUrl(null);
      setFileList([]);
      setIsUpload(false);
      setUrlFile({});
    }
  }, [reset, form]);

  const reloadPage = () => {
    setTypeModal({
      typeModal: 4,
      openModal: false,
    });
    form.resetFields();
    setEditorData("");
    setIntrotext("");
    setImageUrl(null);
    setFileList([]);
    setUrlFile({});
    setOnReload();
  };

  // ✅ FIXED: onFinish dùng introtext state
  const onFinish = async (values: any) => {
    try {
      console.log(values)
      const formData = {
        ...values,
        picture: '',
        alias:values?.alias?.replaceAll("_","-"),
        introtext: introtext,
        created: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        title_alias: values?.title  ,
        urls: urlFile?.pictureUrl,
        images: urlFile?.pictureName
      };

      if (typeModal === 1) {
        const response = await createContent(formData);
        if (response.Code === 200) {
          message.success("Tạo bài viết thành công!").then(() => {
            reloadPage();
          });
        } else {
          message.error(response.Message || "Tạo bài viết thất bại!");
        }
      } else {
        const response = await updateContent(data?.id, formData);
        if (response.Code === 200) {
          message.success("Cập nhật bài viết thành công!").then(() => {
            reloadPage();
          });
          // reloadPage();
        } else {
          message.error(response.Message || "Cập nhật bài viết thất bại!");
        }
      }
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra!");
    }
  };

  const submitWithState = (stateValue: number) => {
    form
      .validateFields()
      .then(values => {
        onFinish({
          ...values,
          state: stateValue
        });
      })
      .catch(() => {
        message.warning("Vui lòng nhập đầy đủ thông tin!");
      });
  };
  // Load data từ props
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data.title,
        image_desc: data.image_desc,
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
      setIntrotext(data.introtext || ""); // ✅ Sync introtext
      setImageUrl(data?.urls);
      setIsUpload(false);
      setUrlFile({});
      if (data?.urls) {
        setFileList([{
          uid: '-1',
          name: data?.images,
          status: 'done',
          url: data?.urls,
        }]);
        setUrlFile({
          pictureName: data?.images,
          pictureUrl: data?.urls,
        });
      }
    }
  }, [data, form]);

  // Auto generate alias
  useEffect(() => {
    if (!title) {
      setAlias("");
      form.setFieldsValue({ alias: "" });
      return;
    }

    setLoadingAlias(true);
    const handler = setTimeout(() => {
      const converted = removeVietnameseTones(title);
      // console.log(converted)
      setAlias(converted.replaceAll("_","-"));
      form.setFieldsValue({ alias: converted });
      setLoadingAlias(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [title, form]);

  useEffect(() => {
    typeModal == 1 && setAlias('');
  }, [typeModal]);

  return (
    <div className="px-4 py-2 w-full">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        // onClick={(e) => {
        //   // Ngăn submit khi click vào FileManager
        //   if (e.target.closest('.ant-upload') || e.target.closest('[class*="file-manager"]')) {
        //     e.stopPropagation();
        //   }
        // }}
        className="[&_.ant-form-item]:!mb-[10px]"
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            width: "100%",
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
                {typeModal == 2 && (
                  <Tag
                    color={data?.state == 1 ? "green" : "orange"}
                    className="pl-3"
                  >
                    {data?.state == 1 ? `Đã xuất bản` : `Chưa xuất bản`}
                  </Tag>
                )}
              </Space>
            </div>

            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Nhập tiêu đề!" }]}
            >
              <TextArea
                rows={2}
                placeholder="Nhập tiêu đề bài viết"
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Item>

            <Form.Item name="picture" label="" colon={false} style={{ marginBottom: 0 }}>
              <div className="space-y-3 ">
                {/* 2 buttons */}
                <div className="flex gap-2">
                  <Button
                    icon={<UploadOutlined />}
                    onClick={() => setShowFileManagerCover(true)}
                    disabled={!!coverImage}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 border-blue-200 h-11 w-16"
                  // icon={<span className="text-lg">📁</span>}
                  >
                    Tải ảnh mới
                  </Button>
                  {/* <Upload {...uploadPropsLocal} className="flex-1">
                    <Button
                      icon={<UploadOutlined />}
                      disabled={isUpload || !!coverImage}
                      className="w-full h-11"
                      loading={isUpload}
                    >
                      Tải ảnh mới
                    </Button>
                  </Upload> */}
                </div>

                {/* Preview ảnh */}
                {coverImage && (
                  <div className="relative bg-gray-50 p-2 rounded-lg border-2 border-dashed border-gray-200">
                    <img
                      src={coverImage.url}
                      alt={coverImage.name}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <div className="absolute top-2 right-2 flex gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
                      <span className="text-xs text-gray-600 truncate max-w-32">{coverImage.name}</span>
                      <button
                        onClick={() => {
                          setCoverImage(null);
                          setUrlFile({});
                        }}
                        className="ml-1 text-red-500 hover:text-red-700 text-sm font-bold"
                        title="Xóa ảnh"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Form.Item>

            {/* FileManager Modal */}
            {showFileManagerCover && (
              <FileManager
                onSelect={(url, name) => {
                  setCoverImage({ url, name });
                  setUrlFile({ pictureName: name, pictureUrl: url });
                  setShowFileManagerCover(false);
                }}
                onClose={() => setShowFileManagerCover(false)}
              />
            )}

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

            {/* ✅ HIDDEN FIELD để Form nhận data */}
            <Form.Item name="introtext" style={{ display: 'none' }}>
              <Input value={introtext} />
            </Form.Item>

            {/* ✅ TEXTEDITOR BÊN NGOÀI Form.Item - KHÔNG submit khi mở FileManager */}
            <div style={{ marginBottom: 16 }}>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Nội dung bài viết <span className="text-red-500">*</span>
              </label>
              <TextEditor
                content={content}
                // editorData={editorData}
                setEditorData={(value) => {
                  setEditorData(value);
                  setIntrotext(value); // ✅ SYNC với hidden field
                  // setContent(value);
                }}
                toolbar="full"
              />
            </div>

            {/* <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => setTypeSub(1)}
                loading={isUpload}
              >
                {typeModal === 1 ? "Xuất bản" : "Cập nhật bài viết"}
              </Button>
              <Button
                type="default"
                htmlType="submit"
                className="!ml-3"
                onClick={() => setTypeSub(0)}
              >
                Chưa xuất bản
              </Button>
            </Form.Item> */}
            <div
              style={{
                position: "sticky",
                bottom: 0,
                background: "#fff",
                padding: "16px 0",
                borderTop: "1px solid #eee",
                marginTop: 16,
                zIndex: 10,
              }}
            >
              <Space>
                <Button
                  type="primary"
                  loading={isUpload}
                  onClick={() => submitWithState(1)}
                >
                  {typeModal === 1 ? "Xuất bản" : "Cập nhật bài viết"}
                </Button>

                <Button
                  onClick={() => submitWithState(0)}
                >
                  Chưa xuất bản
                </Button>

                <Button
                  type="dashed"
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    form.resetFields();
                    setEditorData("");
                    setIntrotext("");
                    setContent("");
                    setCoverImage(null);
                    setUrlFile({});
                    setFileList([]);
                    setAlias("");
                    message.success("Đã reset lại bài viết");
                  }}
                >
                  Reset trắng bài viết
                </Button>
              </Space>

            </div>
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
