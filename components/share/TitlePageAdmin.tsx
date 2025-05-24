import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';

interface TitlePageAdminProps {
  text: string;
}

const TitlePageAdmin: React.FC<TitlePageAdminProps> = ({ text }) => (
  <Breadcrumb className='!ml-4 !pt-1'
    items={[
      {
        href: '/dashboard',
        title: <HomeOutlined style={{fontSize:18,verticalAlign:'middle'}}/>,
      },
      {
        title: <span className="text-lg pb-2 font-medium text-gray-500 align-middle">{text}</span>,
      },
    ]}
  />
);

export default TitlePageAdmin;