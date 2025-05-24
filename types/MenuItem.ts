export interface MenuItem {
    id: number;
    name: string;
    alias: string;
    link: string;
    menutype: string;
    parent: number;
    ordering: number;
    published: number;
    children?: MenuItem[];
    key?: number; // antd Table yêu cầu
  }