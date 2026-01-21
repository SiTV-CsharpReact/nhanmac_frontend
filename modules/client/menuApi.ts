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
  const url = new URL(`${env.apiUrl}/categories/${alias}`);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("pageSize", pageSize.toString());

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      console.error("HTTP error:", response.status);
      return {
        Code: response.status,
        Message: "HTTP error",
        Data: [],
      };
    }

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("API trả HTML:", text);
      return {
        Code: 500,
        Message: "Invalid JSON response",
        Data: [],
      };
    }

    const data: ApiResponse<Post[]> = await response.json();

    if (data.Code !== 200) {
      console.warn("API logic error:", data.Message);
      data.Data = [];
    }

    return data;
  } catch (err) {
    console.error("fetchCateAlias exception:", err);
    return {
      Code: 500,
      Message: "Fetch failed",
      Data: [],
    };
  }
};

export const fetchCate = async (alias: string): Promise<ApiResponse<Post[]>> => {
  try {

    const response = await fetch(`${env.apiUrl}/categories/${alias}`, {
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
): Promise<{ data?: ApiResponse<Post> }> => {
  const url = `${env.apiUrl}/contents/${slug}-${id}.html`;
  console.log(url)
  try {
    const response = await fetch(url, {
      next: {
        revalidate: 60,
      },
    });

    // ❗ BẮT BUỘC kiểm tra status
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";

    // ❗ BẮT BUỘC kiểm tra JSON
    if (!contentType.includes("application/json")) {
      throw new Error("API không trả JSON");
    }

    const data: ApiResponse<Post> = await response.json();
    return { data };
  } catch (error: any) {
    // ❗ notification chỉ chạy ở client
    if (typeof window !== "undefined") {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể lấy chi tiết bài viết",
      });
    }

    // ⚠️ Quan trọng: throw lại để page xử lý notFound / error boundary
    throw error;
  }
};
