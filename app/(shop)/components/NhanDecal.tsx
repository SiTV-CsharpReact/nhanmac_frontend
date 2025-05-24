import { fetchCateAlias } from '@/modules/client/menuApi';
import { Post } from '@/types/contentItem';
import Image from 'next/image';
import Link from 'next/link';
type Props = {
    categoryKey: string;
    textTitle: string
}
const NhanDecal = async ({ categoryKey, textTitle }: Props) => {
    let postList: Post[] = [];
    const res = await fetchCateAlias(categoryKey as string, 1, 4);
    postList = res.Data?.list || [];

    return (
        <div className="bg-[#EAF2FE] p-2 md:p-5">
            <h2 className="text-2xl md:text-[32px] font-semibold text-center uppercase">
                {textTitle}
            </h2>
            <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[255px] mb-5 sm:w-[255px]"></div>
            <div className="grid grid-cols-2 gap-4 items-stretch">
                {postList.slice(0, 4).map((label, i) => (
                    <Link href={`${label.alias + '-' + label.id}.html`} key={`${label.id}-${i}`}
                        className="group bg-white shadow-custom rounded  items-center overflow-hidden cursor-pointer"
                    >
                        <div className="bg-white shadow-custom rounded  flex flex-col h-full">
                            <div className="relative w-full h-[173px] rounded overflow-hidden bg-gray-100">
                                {label?.urls ? (
                                    <Image
                                        src={`https://nhanmac.vn/${label.urls}`}
                                        alt={label.image_desc || "Ảnh sản phẩm"}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        className="transition-transform duration-300 ease-in-out group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-center text-sm">
                                        Ảnh không có sẵn
                                    </div>
                                )}
                            </div>
                            <p
                                className="text-[15px] h-[60px] font-normal text-[#2F80ED] text-left p-2.5 transition-colors duration-300 group-hover:text-orange-500"
                                style={{
                                    overflow: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                {label.content_title}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
export default NhanDecal;