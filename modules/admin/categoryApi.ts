import { ApiResponse } from "@/types/apiResponse";
import { Categories, Category } from "@/types/categoryItem";
import { env } from "@/config/env";
// import { Post } from "@/types/contentItem";

// categoryApi.ts
// categoryApi.ts
const API_URL = `${env.apiUrl}/categories`;

export const categoryApi = {
  async getAllSection(): Promise<ApiResponse<Categories[]>> {
    const res = await fetch(`${env.apiUrl}/categories/menu`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  },
  async getParent(): Promise<ApiResponse<Category[]>> {
    const res = await fetch(`${env.apiUrl}/categories/parent`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  },
  async getAll(): Promise<ApiResponse<Category[]>> {
    const res = await fetch(`${env.apiUrl}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  },
  async getDetail(id: number, type: number): Promise<ApiResponse<Category>> {
    try {
      const res = await fetch(`${API_URL}/detail/${id}?type=${type}`);
  
      if (!res.ok) {
        throw new Error(`Failed to fetch category details: ${res.status} ${res.statusText}`);
      }
  
      const data: ApiResponse<Category> = await res.json();
      return data;
    } catch (error) {
      // Bạn có thể xử lý thêm hoặc log lỗi ở đây
      throw error;
    }
  },
  async create(category: Omit<Category, "id">): Promise<ApiResponse<Category>> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error("Failed to create category");
    return await res.json();
  },

  async update(id: number, type: number, category: Partial<Category>): Promise<ApiResponse<Category>> {
    const res = await fetch(`${API_URL}/${id}?type=${type}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error("Failed to update category");
    return await res.json();
  },

  async delete(id: number, type: number): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_URL}/${id}?type=${type}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete category");
    return await res.json();
  },
  async createParent(category: Omit<Category, "id">): Promise<ApiResponse<Category>> {
    const res = await fetch(`${API_URL}/section`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error("Failed to create category");
    return await res.json();
  },
};
