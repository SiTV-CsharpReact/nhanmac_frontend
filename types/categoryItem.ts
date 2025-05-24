export interface Category {
    id: number;
    title: string;
    name: string;
    alias: string;
    parent_id: number | null;
    image?: string;
    section?: string;
    image_position?: string;
    description?: string;
    published: number;
    checked_out?: number;
    checked_out_time?: string;
    editor?: string;
    ordering?: number;
    access?: number;
    count?: number;
    params?: string;
    children?:Categories[];
  }
  export interface Categories {
    section_id: number;
    section_title: string;
    category_id: number;
    category_title: string;
    alias: string;
    alias_parent: string;
    parent_id: number;
    published:number
  }