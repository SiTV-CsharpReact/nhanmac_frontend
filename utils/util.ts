import dayjs from "dayjs";

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
  export const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
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
    // Ưu tiên ID ở cuối: -600, --600, ---600 ...
    const endMatch = cleanSlug.match(/-+(\d+)$/);
    if (endMatch) {
      return {
        id: Number(endMatch[1]),
        alias: cleanSlug.substring(0, endMatch.index),
      };
    }
  
    // Fallback: lấy số đầu tiên trong slug (377-...)
    const firstNumberMatch = cleanSlug.match(/(?:^|\/|-)(\d+)-/);
    return {
      id: firstNumberMatch
        ? Number(firstNumberMatch[1] || firstNumberMatch[2])
        : null,
      alias: cleanSlug,
    };
  }

// export const removeVietnameseTones = (str: string) => {
//   return str
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/đ/g, "d")
//     .replace(/Đ/g, "D")
//     .replace(/\s+/g, "-")
//     .replace(/[^\w\-]+/g, "")
//     .replace(/\-\-+/g, "-")
//     .replace(/^-+|-+$/g, "")
//     .toLowerCase();
// };
export const removeVietnameseTones = (str: string) => {
  // Chuyển mã hóa (%20, ...) thành dấu cách trước để xử lý toàn diện
  str = decodeURIComponent(str);
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu Unicode
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/\s+/g, '_')           // Thay toàn bộ dấu cách bằng "_"
    // .replace(/[^\w\-\.]/g, '');     // Loại các ký tự đặc biệt còn lại, trừ _ - .
    .toLowerCase();  
};

export const renderUrl = (url: string | null | undefined) =>{
  let urlLink ="";
  if(url){
    if(url.includes("https")||url.includes("http")){
      urlLink = url
    }
    else{
      urlLink = `https://backend.nhanmac.vn/${url}`
    }
  }
  
  return removeVietnameseTones(urlLink)
}
// export const renderSlugUrl = (url: string | null | undefined) =>{
//   let urlLink ="";
//   if(url){
//     if(url.includes("https")||url.includes("http")){
//       urlLink = url
//     }
//     else{
//       urlLink = `https://backend.nhanmac.vn/upload/image/${url}`
//     }
//   }
//   // console.log(removeVietnameseTones(urlLink),'zo')
//   return removeVietnameseTones(urlLink)
// }
export const renderSlugUrl = (url?: string | null) => {
  console.log(url)
  if (!url) return "";

  let urlLink = url.trim();

  const isAbsolute = /^https?:\/\//i.test(urlLink);

  // Decode %20, %xx
  try {
    urlLink = decodeURIComponent(urlLink);
  } catch (e) {
    // ignore malformed URI
  }

  // Bỏ "/" đầu nếu có
  urlLink = urlLink.replace(/^\/+/, "");

  if (!isAbsolute) {
    if (urlLink.startsWith("upload/image/")) {
      urlLink = `https://backend.nhanmac.vn/${urlLink}`;
    } else {
      urlLink = `https://backend.nhanmac.vn/upload/image/${urlLink}`;
    }
  }

  // Normalize path
  // urlLink = urlLink
  //   .replace(/_/g, "-")       // _ → -
  //   .replace(/\s+/g, "-")     // space → -
  //   .replace(/--+/g, "-");    // gộp --

  return removeVietnameseTones(urlLink.toLowerCase());
};

export const  normalizeSlug=(slug: string | string[]) =>{

  // Nếu slug là string thì xử lý như cũ
  if (typeof slug === 'string') {
    return slug.replace(/^\/+/, '').replace(/\/+$/, '');
  }

  // slug là array - chỉ kiểm tra phần tử CUỐI CÙNG có phải số không
  const lastPart = slug[slug.length - 1];
  const hasNumberAtEnd = /\d+/.test(lastPart);

  // Nếu phần tử cuối có số thì lấy từ vị trí đó về cuối, ngược lại lấy toàn bộ
  const normalizedParts = hasNumberAtEnd 
    ? slug.slice(slug.lastIndexOf(lastPart)) 
    : slug;

  return normalizedParts.join('/');
}

// export const renderUrl = (url: string | null | undefined) => {
//   let urlLink = '';
//   if (url) {
//     let urlNoAccent = removeVietnameseTones(url);
//     if (urlNoAccent.includes('https') || urlNoAccent.includes('http')) {
//       urlLink = urlNoAccent;
//     } else {
//       urlLink = `https://backend.nhanmac.vn/${urlNoAccent}`;
//     }
//   }
//   return urlLink;
// };