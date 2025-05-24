"use client";
import TitlePage from "@/components/share/TitlePage";
import { Post } from "@/types/contentItem";
import { notification } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchNewTopPosts } from "@/modules/admin/newApi";
const products = [
  { id: 1, name: "Tem nhôm phay xước", img: "/images/product.jpg" },
  { id: 2, name: "Tem nhôm phủ keo", img: "/images/product.jpg" },
  { id: 3, name: "Tem nhôm ăn mòn", img: "/images/product.jpg" },
  { id: 4, name: "Tem kim loại siêu mỏng", img: "/images/product.jpg" },
  { id: 5, name: "Tem nhãn inox ăn mòn", img: "/images/product.jpg" },
  // Thêm sản phẩm nếu muốn
];

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const loadNewTopPosts = async () => {
    setLoading(true);
    try {
        const data = await fetchNewTopPosts();
        setPosts(data);
    } catch (e: any) {
        notification.error({ message: "Lỗi", description: e.message });
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {

    loadNewTopPosts()
  }, []);
  return (
    <main className="m-auto grid place-items-center">
      <div className="container mb-15">
        <TitlePage text={"Tin tức"} />
        
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-6">
          {/* Cột bên trái - Sản phẩm */}
          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-2 rounded shadow-custom hover:shadow-lg transition"
                >
                  <Image
                    src={product.img}
                    width={300}
                    height={300}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <h3 className="mt-2 text-center text-sm font-semibold">
                    {product.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Cột bên phải - Sidebar */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            {/* Bài viết mới */}
            <div className="bg-blue-50 p-4 rounded">
              <h2 className="text-2xl font-semibold mb-2 text-center">
                Bài viết mới
              </h2>
              <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[160px] mb-5"></div>
              {loading && <p className="text-center">Đang tải...</p>}
              {!loading && posts.length === 0 && (
                <p className="text-center text-gray-500">Chưa có bài viết mới</p>
              )}
              {!loading &&
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex bg-white gap-2 mb-3 cursor-pointer hover:bg-gray-100 rounded p-2"
                  >
                    <Image
                      src="/images/post.jpg"
                      width={80}
                      height={60}
                      alt={post.title}
                      className="object-cover rounded"
                    />
                    <span className="m-4 text-base line-clamp-2">{post.title}</span>
                  </div>
                ))}
            </div>

            {/* Hỗ trợ trực tuyến */}
            <div className="bg-blue-50 p-4 rounded mt-2">
              <h2 className="text-2xl font-semibold mb-2 text-center">
                Hỗ trợ trực tuyến
              </h2>
              <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[160px] mb-5"></div>
              <div className="text-[#2F80ED] text-center text-2xl font-semibold">
                Ms. Lan Anh
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                {/* Hotline 24/7 */}
                <div className="flex items-center gap-4 col-span-7 md:col-span-7">
                  <Image
                    src="/icons/phone-call-red.svg"
                    alt="Hotline"
                    width={62}
                    height={62}
                  />
                  <div>
                    <p className="font-bold">Hotline 24/7</p>
                    <a href="tel:0912424368" className="text-[#EB5757] text-xl font-bold">
                      0912.424.368
                    </a>
                  </div>
                </div>

                {/* Hỗ trợ khách hàng */}
                <div className="flex items-center gap-4 col-span-5 md:col-span-5">
                  <div>
                    <p className="font-medium text-[#828282] text-base">
                      Hỗ trợ khách hàng
                    </p>
                    <div className="flex gap-2 mt-1">
                      <a
                        href="https://zalo.me/..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <Image
                          src="/icons/Icon_of_Zalo.svg"
                          alt="Zalo"
                          width={34}
                          height={34}
                        />
                      </a>
                      <a
                        href="https://facebook.com/..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[#2F80ED]"
                      >
                        <Image
                          src="/icons/brand-facebook-no-border.svg"
                          alt="Facebook"
                          width={24}
                          height={24}
                        />
                      </a>
                      <a
                        href="mailto:..."
                        className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-white border-2 border-[#EB5757]"
                      >
                        <Image
                          src="/icons/brand-gmail-no-border.svg"
                          alt="Gmail"
                          width={24}
                          height={24}
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
