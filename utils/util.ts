import dayjs from "dayjs";
import moment from "moment";

export function getConstantLabel(
    CONSTANT: ConstantItem[],
    text: string|number
  ): string {
    const found = CONSTANT.find((item) => item.value === text);
    return found ? found.label : "-";
  }
  export function getTagColor(
    CONSTANT: ConstantItem[],
    color: string
  ): string {
    const found = CONSTANT.find((item) => item.value === color);
    return found ? found?.color : "-";
  }
  // For disable future date in Antd DatePicker
export const futureDate = (dateDisable:any) => {
    return dateDisable && dateDisable > dayjs();
  };
export const formatMoney = (x:number, currency) => {
    if (x === 0) return "0" + (currency ? ` ${currency}` : "");
    if (x) {
      const parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".") + (currency ? ` ${currency}` : "");
    } else {
      return "-";
    }
  };
  export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
    // utils/buildMenuTree.ts
    interface RawRow {
      section_id: number;
      section_title: string;
      category_id: number;
      category_title: string;
      parent_id: number;
      alias: string;
      alias_parent: string;
    }
    
    export function buildMenuTree(rows: any[]) {
      const sectionMap = new Map<number, any>();
    
      rows.forEach(row => {
        if (!sectionMap.has(row.section_id)) {
          sectionMap.set(row.section_id, {
            key: `section-${row.section_id}`,
            title: row.section_title,
            children: [],
          });
        }
    
        if (row.category_id) {
          const categoryNode = {
            key: `category-${row.category_id}`,
            title: row.category_title,
            alias: row.alias,
            parent_id: row.parent_id,
          };
          sectionMap.get(row.section_id).children.push(categoryNode);
        }
      });
    
      return Array.from(sectionMap.values());
    }

  // utils/slugUtils.ts
export function parseSlug(slug: string) {
  const cleanSlug = slug.replace(/\.html$/, "");
  const match = cleanSlug.match(/-(\d+)$/); // tìm số cuối cùng sau dấu "-"
  return {
    id: match ? Number(match[1]) : null,
    alias: match ? cleanSlug.substring(0, match.index) : cleanSlug,
  };
}

export const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
};
