import { ApiResponse } from "@/types/apiResponse";
import { ListPost, Post } from "@/types/contentItem";
import { notification } from "antd";
import { env } from "@/config/env";

// interface FetchContentParams {
//   page?: number;
//   pageSize?: number;
//   endTime?: string;
//   startTime?: string;
//   state?: number;
//   keySearch?: string;
//   keyword?: string;
//   alias?: string;
// }

// Lấy danh sách bài viết
export const fetchPost = async (): Promise<ApiResponse<ListPost[]>> => {
  try {
    const response = await fetch(`${env.apiUrl}/slides`);
    const data: ApiResponse<ListPost[]> = await response.json();
    
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
        description: error.message || "Không thể lấy danh sách bài viết",
      });
    }
    throw error;
  }
};

export const updateSlideOrder = async (orderedIds: number[]): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${env.apiUrl}/slides/order`, {
        method: "PUT", // hoặc POST tùy API backend
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedIds }),
      });
  
      const data: ApiResponse<void> = await response.json();
  
      if (data.Code !== 200) {
        throw new Error(data.Message || "Có lỗi xảy ra khi lưu thứ tự");
      }
  
      return data;
    } catch (error: any) {
      if (typeof window !== "undefined") {
        notification.error({
          message: "Lỗi",
          description: error.message || "Không thể lưu thứ tự slide",
        });
      }
      throw error;
    }
  };

// Lấy chi tiết bài viết theo ID
export const fetchContentShortId = async (id: number): Promise<ApiResponse<Post>> => {
  try {
    const response = await fetch(`${env.apiUrl}/contents/short/${id}`);
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

// Tạo bài viết mới
// export const createContent = async (content: Partial<Post>): Promise<ApiResponse<Post>> => {
//   try {
//     const response = await fetch(`${env.apiUrl}/contents`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(content),
//     });
//     const data: ApiResponse<Post> = await response.json();
    
//     if (data.Code !== 200) {
//        data.Data = [];
      // Bạn có thể log lỗi hoặc xử lý thông báo ở đây nếu muốn
      console.warn('API trả về lỗi:', data.Message || 'Có lỗi xảy ra');
     
//     }
    
//     return data;
//   } catch (error: any) {
//     if (typeof window !== "undefined") {
//       notification.error({
//         message: "Lỗi",
//         description: error.message || "Không thể tạo bài viết",
//       });
//     }
//     throw error;
//   }
// };

// Cập nhật bài viết
export const updateContent = async (id: number, content: Partial<Post>): Promise<ApiResponse<Post>> => {
  try {
    const response = await fetch(`${env.apiUrl}/slides/edit/${id}`, {
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
export const fetchSearchContents = async (query: string): Promise<ApiResponse<Post>> => {
  try {
    const response = await fetch(`${env.apiUrl}/slides/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Post> = await response.json();

    if (data.Code !== 200) {
      throw new Error(data.Message || 'Có lỗi xảy ra khi tìm kiếm');
    }

    return data;
  } catch (error: any) {
    if (typeof window !== 'undefined') {
      notification.error({
        message: 'Lỗi',
        description: error.message || 'Không thể tìm kiếm bài viết',
      });
    }
    throw error;
  }
};