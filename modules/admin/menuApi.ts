import type { MenuItem } from "@/types/MenuItem";
import { ApiResponse } from "@/types/apiResponse";
import { env } from "@/config/env";

// Lấy danh sách menu
export async function fetchMenus(): Promise<ApiResponse<MenuItem[]>> {
  const res = await fetch(`${env.apiUrl}/menu`);
  if (!res.ok) throw new Error("Lỗi lấy danh sách menu");
  return await res.json();
}

// Thêm menu mới
export async function addMenu(data: Omit<MenuItem, "id" | "children" | "key">): Promise<ApiResponse<MenuItem>> {
  const res = await fetch(`${env.apiUrl}/menu/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Lỗi thêm menu");
  }
  return await res.json();
}

// Sửa menu
export async function editMenu(id: number, data: Omit<MenuItem, "id" | "children" | "key">): Promise<ApiResponse<MenuItem>> {
  const res = await fetch(`${env.apiUrl}/menu/edit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Lỗi sửa menu");
  }
  return await res.json();
}

// Xóa menu
export async function deleteMenu(id: number): Promise<ApiResponse<void>> {
  const res = await fetch(`${env.apiUrl}/menu/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Lỗi xóa menu");
  }
  return await res.json();
}
