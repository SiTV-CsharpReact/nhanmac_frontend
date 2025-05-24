import { Post } from "@/types/contentItem";
import { ApiResponse } from "@/types/apiResponse";
import { env } from "@/config/env";

// Lấy danh sách bài viết mới nhất
export async function fetchNewTopPosts(): Promise<ApiResponse<Post[]>> {
  const res = await fetch(`${env.apiUrl}/news/top-posts`);
  if (!res.ok) throw new Error("Lỗi lấy danh sách bài viết");
  return await res.json();
}
  