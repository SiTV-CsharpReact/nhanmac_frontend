import { fetchCateAlias } from '@/modules/client/menuApi';
import { Post } from '@/types/contentItem';
import Image from 'next/image';
import Link from 'next/link';

export default async function TinTuc() {
  let postList: Post[] = [];
  const res = await fetchCateAlias('tin-tong-hop' as string, 1, 5);
  postList = res.Data?.list || [];

  return (
    <div className="bg-[#EAF2FE] p-2 md:p-5">
      <h2 className="text-2xl md:text-[32px] font-semibold text-center ">
        TIN TỨC
      </h2>
      <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[255px] mb-5 sm:w-[255px]"></div>
      <div className="grid grid-cols-2 gap-4">
        {postList.slice(0, 2).map((label, i) => (
          <Link
            href={`${label.alias +'-'+ label.id}.html`}
            key={`${label.id}-${i}`}
            className="group bg-white shadow-custom rounded flex flex-col items-center overflow-hidden cursor-pointer"
          >
            <div className="relative w-full  h-[173px] aspect-[245/173] bg-gray-100  overflow-hidden rounded-md">
              {label.urls ? (
                <Image
                  src={`https://nhanmac.vn/${label.urls}`}
                  alt={label.image_desc || "Ảnh sản phẩm"}
                  fill
                  style={{ objectFit: 'cover' }}
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
            <p className="text-[15px] font-normal text-[#2F80ED] text-left p-2 pt-3 transition-colors duration-300 group-hover:text-orange-500">
              {label.content_title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
