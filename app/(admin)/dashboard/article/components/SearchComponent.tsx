import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, message, Select } from "antd";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale("en");
dayjs.locale("vi");
import { futureDate } from "../../../../../utils/util";
import { RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { useCategories } from "@/hooks/useCategories";
const dateFormat = "DD/MM/YYYY";

const { RangePicker } = DatePicker;

interface SearchComponentProps {
  setOnReload?: (value: boolean) => void;
  form: any;
  setFixedParams: (params: any) => void;
  setOnResetFilter?: (value: boolean) => void;
  productTypeOptions: { label: string; value: number; color: string }[];
}
const { Option } = Select;
const SearchComponent: React.FC<SearchComponentProps> = ({
  setOnReload,
  form,
  setFixedParams,
  setOnResetFilter,
  productTypeOptions,
}) => {
  const { selectOptions, loading } = useCategories();
  const initialValues = {
    created: [dayjs().subtract(3, "month"), dayjs()], // RangePicker expects array of moments
    state: 1,
    sectionid: undefined,
    keyword: "",
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
    // Khởi tạo fixedParams với giá trị mặc định (chuyển ngày sang chuỗi DD/MM/YYYY)
    setFixedParams({
      createdFrom: initialValues.created[0].format(dateFormat),
      createdTo: initialValues.created[1].format(dateFormat),
      state: 1,
      sectionid: undefined,
      keyword: "",
    });
  }, []);

  const search = async () => {
    const values = await form.validateFields();
    // console.log(values)
    const { created, state, sectionid, keyword } = values;

    if (
      Array.isArray(created) &&
      created.length === 2 &&
      dayjs.isDayjs(created[0]) &&
      dayjs.isDayjs(created[1])
    ) {
      setFixedParams({
        createdFrom: created[0].format(dateFormat),
        createdTo: created[1].format(dateFormat),
        state,
        sectionid,
        keyword,
      });
      setOnReload && setOnReload(true);
    } else {
      message.error("Giá trị ngày không hợp lệ");
    }
  };

  const resetFields = () => {
    form.resetFields();
    form.setFieldsValue(initialValues);
    setOnResetFilter && setOnResetFilter(true);
    search();
  };

  return (
    <Form form={form} layout={"vertical"} initialValues={initialValues}>
      <div className="flex gap-4 justify-center bg-white rounded p-4">
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <Form.Item name="created" label="Ngày XB:">
            <RangePicker
              style={{ width: "100%" }}
              format={dateFormat}
              // onChange={(dates) => {
              //   form.setFieldValue("created", dates);
              // }}
              disabledDate={(current) => futureDate(current)}
            />
          </Form.Item>
        </div>

        <div style={{ width: "100%", maxWidth: "250px" }}>
          <Form.Item name="state" label="Trạng thái:">
            <Select
              style={{ width: "100%" }}
              options={productTypeOptions}
              allowClear
            />
          </Form.Item>
        </div>

        <div style={{ width: "100%", maxWidth: "250px" }}>
          <Form.Item name="sectionid" label="Chuyên mục:">
            <Select
              showSearch
              loading={loading}
              placeholder="Chọn chuyên mục"
              options={selectOptions}
              filterOption={(input, option) =>
                (option?.label as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              style={{ width: "100%" }}
              allowClear
            />
          </Form.Item>
        </div>

        <div style={{ width: "100%", maxWidth: "300px" }}>
          <Form.Item name="keyword" label="Từ khóa:">
            <Input placeholder="Nhập từ khóa..." allowClear />
          </Form.Item>
        </div>

        <div
          style={{
            display: "flex",
            // justifyContent: "center",
            gap: 16,
            marginTop: 30,
            width: "100%",
          }}
        >
          <Button
            icon={<RedoOutlined />}
            onClick={resetFields}
            style={{ width: "10rem" }}
          >
            Làm mới bộ lọc
          </Button>

          <Button
            type="primary"
            onClick={search}
            style={{ width: "10rem" }}
            icon={<SearchOutlined />}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default SearchComponent;
