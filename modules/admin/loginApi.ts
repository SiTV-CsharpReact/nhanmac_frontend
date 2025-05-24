// api/authApi.ts

import type { ApiResponse } from "@/types/apiResponse";
import { env } from "@/config/env";

interface LoginPayload {
  username: string;
  password: string;
}

/**
 * Gửi yêu cầu đăng nhập
 * @param data - Thông tin đăng nhập gồm username và password
 * @returns ApiResponse với thông tin người dùng hoặc token nếu thành công
 */
export async function login(
  data: LoginPayload
): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(`${env.apiUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Đăng nhập thất bại");
    }

    return responseData;
  } catch (error: any) {
    console.error("Lỗi khi gọi API đăng nhập:", error);
    throw new Error(error.message || "Lỗi không xác định");
  }
}
