import { Post } from "@/types/contentItem";
import Image from "next/image";
import { fetchSlides } from "@/modules/client/hompageApi";
import Link from "next/link";

export const revalidate = 60;

// Component con cho Social Icon (giữ nguyên)
const SocialIcon = ({
  href,
  icon,
  alt,
  bgColor = "",
}: {
  href: string;
  icon: string;
  alt: string;
  bgColor?: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer nofollow"
    className={`flex items-center justify-center w-[34px] h-[34px] rounded-full ${bgColor}`}
  >
    <Image src={icon} alt={alt} width={24} height={24} aria-label={alt} />
  </a>
);

// Component SupportSection (giữ nguyên)
const SupportSection = () => (
  <div
    className="bg-blue-50 p-4 rounded "
    itemScope
    itemType="https://schema.org/ContactPage"
  >
    {/* Nội dung SupportSection giữ nguyên */}
    <h2 className="text-2xl font-semibold mb-2 text-center">
      Hỗ trợ trực tuyến
    </h2>
    <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[160px] mb-5"></div>

    <div
      className="text-[#2F80ED] text-center text-2xl font-semibold"
      itemProp="name"
    >
      Ms. Lan Anh
    </div>

    <div className="grid grid-cols-12 gap-4 mt-4">
      <div className="flex items-center gap-4 col-span-7 md:col-span-7">
        <Image
          src="/icons/phone-call-red.svg"
          alt="Hotline"
          width={62}
          height={62}
          aria-hidden="true"
        />
        <div>
          <p className="font-bold">Hotline 24/7</p>
          <a
            href="tel:0912424368"
            className="text-[#EB5757] text-xl font-bold"
            itemProp="telephone"
          >
            0912.424.368
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4 col-span-5 md:col-span-5">
        <div>
          <p className="font-medium text-[#828282] text-base">
            Hỗ trợ khách hàng
          </p>
          <div className="flex gap-2 mt-1">
            <a
              href="https://zalo.me/84912424368"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={`flex items-center justify-center w-[34px] h-[34px] rounded-full`}
            >
              <Image
                src={"/icons/Icon_of_Zalo.svg"}
                alt={"Zalo"}
                width={34}
                height={34}
                aria-label={"Zalo"}
              />
            </a>
            <SocialIcon
              href="https://facebook.com/nhanmac.vn"
              icon="/icons/brand-facebook-no-border.svg"
              alt="Facebook Messenger"
              bgColor="bg-[#2F80ED]"
            />
            <SocialIcon
              href="mailto:nhanmac.vn@gmail.com"
              icon="/icons/brand-gmail-no-border.svg"
              alt="Gmail liên hệ"
              bgColor="bg-white border-2 border-[#EB5757]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Component chính với SSR
export default async function PostNews() {
  let posts: Post[] = [];
  try {
    const res = await fetchSlides();
    posts = res.Data;
  } catch (error) {
    console.error("Lỗi khi tải bài viết:", error);
  }

  return (
    <div className="sticky top-42.5 ">
      <section
        aria-label="Danh sách bài viết mới"
        className="bg-blue-50 p-4 rounded xl:h-[530px]  lg:h-[400px] lg:overflow-auto"
      >
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Bài viết mới
        </h2>
        <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[160px] mb-5"></div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">Chưa có bài viết mới</p>
        ) : (
          <ul>
            {posts.slice(3, 7).map((post, i) => (
              <Link
                href={`${post.alias + "-" + post.id}.html`}
                title={post.title}
                key={post.id}
                className="group"
              >
                <li className="bg-white gap-4 mb-3 hover:bg-gray-100 rounded  !h-[96px] grid grid-cols-[150px_1fr]">
                  {/* Container ảnh cố định kích thước */}
                  <div className="relative w-[150px] h-[96px] bg-gray-100 overflow-hidden">
                    {post.urls ? (
                      <Image
                        src={
                          post.urls?.startsWith("http")
                            ? post.urls
                            : `https://nhanmac.vn/${post.urls}`
                        }
                        alt={post.image_desc || "Ảnh sản phẩm"}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 150px"
                        className="rounded-l-md transition-transform duration-300 ease-in-out group-hover:scale-110"
                        priority={i < 2}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Ảnh không có sẵn
                      </div>
                    )}
                  </div>

                  <span
                    className="mr-3 mt-3 text-base line-clamp-2 lg:line-clamp-none group-hover:text-[#2F80ED]"
                    aria-label={`Đọc bài viết: ${post.title}`}
                  >
                    {post.title}
                  </span>
                </li>

              </Link>
            ))}
          </ul>
        )}
      </section>

      <aside className="self-start mt-3">
        <SupportSection />
      </aside>
    </div>
  );
}
