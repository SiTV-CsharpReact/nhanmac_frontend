import { env } from "../../config/env";
import { ApiResponse } from "@/types/apiResponse";
import { Post } from "@/types/contentItem";
import type { MenuItem } from "@/types/MenuItem";
import { notification } from "antd";

// Lấy danh sách menu
export async function fetchMenus(): Promise<ApiResponse<MenuItem[]>> {
  const res = await fetch(`${env.apiUrl}/menu`);
  if (!res.ok) throw new Error("Lỗi lấy danh sách menu");
  return await res.json();
}
// Lấy bài viết theo alias
export const fetchCateAlias = async (
  alias: string,
  page: number = 1,
  pageSize: number = 9
): Promise<ApiResponse<Post[]>> => {
  try {
    const url = new URL(`${env.apiUrl}/categories/${alias}`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("pageSize", pageSize.toString());

    const response = await fetch(url.toString(), {
      // cache: "no-store", 
      next: {
      revalidate: 60, // Cache trong 60 giây
    }, });

    const data: ApiResponse<Post[]> = await response.json();
    if (data.Code !== 200) {
      data.Data = [];
      // Bạn có thể log lỗi hoặc xử lý thông báo ở đây nếu muốn
      console.warn('API trả về lỗi:', data.Message || 'Có lỗi xảy ra');
     
    }
    return data;
  } catch (error: any) {
    if (typeof window !== "undefined") {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể lấy bài viết",
      });
    }
    throw error;
  }
};


export const fetchCate = async (alias: string): Promise<ApiResponse<Post[]>> => {
  try {
 
    const response = await fetch(`${env.apiUrl}/categories/${alias}`,{
      next: {
        revalidate: 60, // Cache trong 60 giây
      },
  });
    const data: ApiResponse<Post[]> = await response.json();
    // console.log(data)
    if (data.Code !== 200) {
       data.Data = [];
      // Bạn có thể log lỗi hoặc xử lý thông báo ở đây nếu muốn
      console.warn('API trả về lỗi:', data.Message || 'Có lỗi xảy ra');
     
    }
    
    return data;
  } catch (error: any) {
    if (typeof window !== "undefined") {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể lấy bài viết",
      });
    }
    throw error;
  }
};

export const fetchContentBySlugId = async (
  slug: string,
  id: number
): Promise<{ data?: ApiResponse<Post>; redirectUrl?: string }> => {
  try {
    const response = await fetch(`${env.apiUrl}/contents/${slug}-${id}.html`, {
      next: {
        revalidate: 60,
      },
    });

    const data: ApiResponse<Post> = await response.json();

    if (data.Code !== 200) {
      throw new Error(data.Message || "Có lỗi xảy ra");
    }
    // Trả về dữ liệu bài viết bình thường
    return { data };
  } catch (error: any) {
    if (typeof window !== "undefined") {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể lấy chi tiết bài viết",
      });
    }
    throw error;
  }
};