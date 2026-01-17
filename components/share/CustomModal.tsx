import { Modal, ModalProps, Spin } from 'antd';
import React from 'react';

interface CustomModalProps extends ModalProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  spinning?: boolean;
  // open và onCancel đã được kế thừa từ ModalProps
  // open: boolean;
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  children,
  className = '',
  footer = null, // Mặc định không hiển thị footer
  header = '',
  spinning = false,
  ...modalProps
}) => {
  return (
    <Modal
      style={{ top: 40 }}
      {...modalProps}
      className={`custom-modal ${className}`}
      footer={footer}
      title={header}
      width={1400}
    // onCancel={() => onCancel(false)} // Xử lý đóng modal
    >
      <Spin spinning={spinning}>

        <div className="modal-content">
          {children}
        </div>
      </Spin>
    </Modal>
  );
};

export default CustomModal;