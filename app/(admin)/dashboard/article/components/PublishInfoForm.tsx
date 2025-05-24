"use client";
import React, { useEffect, useRef } from "react";
import { Form, DatePicker, Select, Collapse } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useSectionWithCategories } from "@/hooks/useParentCate";
import dayjs from "dayjs";

const { Panel } = Collapse;

export default function PublishInfoForm({ form }: { form: any }) {
  const { sections, getCategoriesBySection, loading } = useSectionWithCategories();
  const selectedSection = Form.useWatch("sectionid", form); // Theo dõi section_id

  const prevSectionRef = useRef<string | number | undefined>();

  useEffect(() => {
    const prevSection = prevSectionRef.current;

    // Nếu đã có giá trị trước đó và nó thay đổi thì mới reset
    if (prevSection && selectedSection && prevSection !== selectedSection) {
      form.setFieldsValue({ catid: undefined });
    }

    // Cập nhật lại giá trị trước đó
    prevSectionRef.current = selectedSection;
  }, [selectedSection, form]);

  return (
    <Collapse defaultActiveKey={['1']} style={{ marginBottom: 14 }}>
      <Panel
        header={
          <span>
            <CalendarOutlined style={{ marginRight: 8, color: "#52c41a" }} />
            Thông tin xuất bản
          </span>
        }
        key="1"
      >
        <Form.Item label="Ngày giờ xuất bản" name="publish_up">
          <DatePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="DD/MM/YYYY HH:mm:ss"
            style={{ width: "100%" }}
            placeholder="Chọn ngày giờ xuất bản"
            defaultValue={dayjs()}
          />
        </Form.Item>

        <Form.Item
          name="sectionid"
          label="Chuyên mục cha"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn chuyên mục cha!",
            },
          ]}
        >
          <Select
            showSearch
            loading={loading}
            placeholder="Chọn chuyên mục cha"
            options={sections}
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="catid"
          label="Chuyên mục con"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn chuyên mục con!",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Chọn chuyên mục con"
            disabled={!selectedSection}
            options={selectedSection ? getCategoriesBySection(selectedSection) : []}
            filterOption={(input, option) =>
              (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: "100%" }}
            allowClear
          />
        </Form.Item>
      </Panel>
    </Collapse>
  );
}
