import { ApiResponse } from "@/types/apiResponse";
import { Category } from "@/types/categoryItem";
import { Post } from "@/types/contentItem";
import { env } from "@/config/env";
// import { Post } from "@/types/contentItem";

// categoryApi.ts
// categoryApi.ts
// const API_URL = `${env.apiUrl}/categories`;
// API lấy danh sách slide
export const fetchSlides = async (): Promise<ApiResponse<Post[]>> => {
  try {
   const response = await fetch(`${env.apiUrl}/slides`, { cache: 'force-cache' });
    const data: ApiResponse<Post[]> = await response.json();
    
    if (data.Code !== 200) {
       data.Data = [];
      // Bạn có thể log lỗi hoặc xử lý thông báo ở đây nếu muốn
      console.warn('API trả về lỗi:', data.Message || 'Có lỗi xảy ra');
     
    }
    
    return data;
  } catch (error: any) {
    console.error('Lỗi khi lấy danh sách slide:', error);
    throw error;
  }
};
