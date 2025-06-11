import { ApiResponse } from "@/types/apiResponse";
import { ListPost, Post } from "@/types/contentItem";
import { notification } from "antd";
import { env } from "../../config/env";

interface FetchContentParams {
  page?: number;
  pageSize?: number;
  endTime?: string;
  startTime?: string;
  state?: number;
  keySearch?: string;
  keyword?: string;
  sectionid?: string;
}

// Lấy danh sách bài viết
export const fetchContent = async (params: FetchContentParams = {}): Promise<ApiResponse<ListPost[]>> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const response = await fetch(`${env.apiUrl}/contents?${queryParams}`);
    const data: ApiResponse<ListPost[]> = await response.json();
    
    if (data.Code !== 200) {
       data.Data = [];
      // Bạn có thể log lỗi hoặc xử lý thông báo ở đây nếu muốn
      console.warn('API trả về lỗi:', data.Message || 'Có lỗi xảy ra');
      // Trả về data đã điều chỉnh
    }
    
    return data;
  } catch (error: any) {
    if (typeof window !== "undefined") {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể lấy danh sách bài viết",
      });
    }
    throw error;
  }
};

// Lấy chi tiết bài viết theo ID
export const fetchContentId = async (id: number): Promise<ApiResponse<Post>> => {
  try {
    const response = await fetch(`${env.apiUrl}/contents/${id}`,{
      next: {
        revalidate: 60, // Cache trong 60 giây
      },
    });
    const data: ApiResponse<Post> = await response.json();
    
    if (data.Code !== 200) {
       data.Data = [];
      // Bạn có thể log lỗi hoặc xử lý thông báo ở đây nếu muốn
      console.warn('API trả về lỗi:', data.Message || 'Có lỗi xảy ra');
      // Trả về data đã điều chỉnh
    }
    
    return data;
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

export const fetchContentShortId = async (id: number): Promise<ApiResponse<Post>> => {
  try {
    const response = await fetch(`${env.apiUrl}/contents/short/${id}`,{
      // next: {
      //   revalidate: 60, // Cache trong 60 giây
      // },
    });
    const data: ApiResponse<Post> = await response.json();
    
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
        description: error.message || "Không thể lấy chi tiết bài viết",
      });
    }
    throw error;
  }
};

// Lấy bài viết theo alias
export const fetchContentAlias = async (alias: string): Promise<ApiResponse<Post>> => {
  try {
 
    const response = await fetch(`${env.apiUrl}/contents/alias/${alias}`,{
      next: {
        revalidate: 60, // Cache trong 60 giây
      },
  });
    const data: ApiResponse<Post> = await response.json();
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

// Tạo bài viết mới
export const createContent = async (content: Partial<Post>): Promise<ApiResponse<Post>> => {
  try {
    const response = await fetch(`${env.apiUrl}/contents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });
    const data: ApiResponse<Post> = await response.json();
    
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
        description: error.message || "Không thể tạo bài viết",
      });
    }
    throw error;
  }
};

// Cập nhật bài viết
export const updateContent = async (id: number, content: Partial<Post>): Promise<ApiResponse<Post>> => {
  try {
    const response = await fetch(`${env.apiUrl}/contents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });
    const data: ApiResponse<Post> = await response.json();
    
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
        description: error.message || "Không thể cập nhật bài viết",
      });
    }
    throw error;
  }
};

// Xóa bài viết
export const deleteContent = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${env.apiUrl}/contents/${id}`, {
      method: 'DELETE',
    });
    const data: ApiResponse<void> = await response.json();
    
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
        description: error.message || "Không thể xóa bài viết",
      });
    }
    throw error;
  }
};

// Upload ảnh
export const uploadImage = async (file: File): Promise<ApiResponse<{ imageUrl: string }>> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(env.uploadUrl, {
      method: "POST",
      body: formData,
    });
    const data: ApiResponse<{ imageUrl: string }> = await response.json();
    
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
        description: error.message || "Không thể upload ảnh",
      });
    }
    throw error;
  }
};
