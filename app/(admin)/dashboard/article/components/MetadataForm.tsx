import React from 'react';
import { Form, Input, Collapse } from 'antd';

const { TextArea } = Input;
const { Panel } = Collapse;

export default function MetadataForm() {
  return (
    <Collapse defaultActiveKey={['1']} style={{ marginBottom: 24 }}>
      <Panel header="Thông tin SEO" key="1">

          <Form.Item label="Description:" name="metadesc">
            <TextArea rows={3} placeholder="Nhập sự miêu tả..." />
          </Form.Item>
          <Form.Item label="Tags,keywords" name="metakey">
            <TextArea rows={3} placeholder="Nhập từ khóa..." />
          </Form.Item>
       
    
      </Panel>
    </Collapse>
  );
}
