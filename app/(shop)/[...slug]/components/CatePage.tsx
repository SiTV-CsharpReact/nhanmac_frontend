import Link from "next/link";
import { Post } from "@/types/contentItem";
import Image from "next/image";
type CatePageProps = {
  postList: Post[];
};

export default function CatePage({ postList }: CatePageProps) {
  if (!postList || postList.length === 0) {
    return <p className="text-center text-gray-500">Không có bài viết nào.</p>;
  }

  return (
    <div className="md:col-span-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {postList.map((label, i) => {
          return (
            <Link
              href={`${label.alias + "-" + label.id}.html`}
              key={`${label.id}-${i}`}
              className="group bg-white shadow-custom rounded  flex flex-col items-center overflow-hidden cursor-pointer"
            >
              <div className="bg-white p-0 flex flex-col items-center cursor-pointer">
                <div className="relative w-full aspect-[245/173] h-[173px] bg-gray-100  overflow-hidden rounded-md">
                  {label.urls ? (
                    <Image
                      src={
                        label.urls?.startsWith("http")
                          ? label.urls
                          : `https://nhanmac.vn/${label.urls}`
                      }
                      alt={label.image_desc || "Ảnh sản phẩm"}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 245px"
                      className="rounded-md transition-transform duration-300 ease-in-out group-hover:scale-110"
                      priority={i < 2}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Ảnh không có sẵn
                    </div>
                  )}
                </div>
                <p className="text-[15px] font-normal text-[#2F80ED] text-left p-2.5 transition-colors duration-300 group-hover:text-orange-500">
                  {label.content_title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
