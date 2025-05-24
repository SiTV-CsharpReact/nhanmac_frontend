import { fetchCateAlias } from '@/modules/client/menuApi';
import { Post } from '@/types/contentItem';
import Image from 'next/image';
import Link from 'next/link';
export default async function NhanVai() {
    let postList: Post[] = [];
    const res = await fetchCateAlias('nhan-vai' as string, 1, 4);
    postList = res.Data?.list || [];

    return (
        <div className="bg-[#EAF2FE] p-2 md:p-5">
            <h2 className="text-2xl md:text-[32px] font-semibold text-center ">
                NHÃN VẢI
            </h2>
            <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[255px] mb-5 sm:w-[255px]"></div>
            <div className="grid grid-cols-2 gap-4">
                {postList.slice(0, 4).map((label, i) => (
                    <Link href={`${label.alias + '-'+label.id}.html`} key={`${label.id}-${i}`} 
                    // onClick={()=>Cookies.set('activeParent', 'Nhãn Vải')}
                    >
                        <div className="bg-white shadow-custom rounded p-2 flex flex-col items-center h-full">
                            <div className="mb-2 flex items-center justify-center w-[245px] !h-[195px] overflow-hidden rounded">
                                {label.urls ? (
                                    <Image
                                    src={`https://nhanmac.vn/${label.urls}`}
                                        alt={label.image_desc || "Ảnh sản phẩm"}
                                        width={245}
                                        height={200}
                                        objectFit="cover"
                                        style={{objectFit: 'cover' }}
                                        layout="responsive"
                                        //  className="rounded object-cover mb-3"
                                       className="w-full !h-53 object-cover mb-3 rounded"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-center">
                                        Ảnh không có sẵn
                                    </div>
                                )}
                            </div>
                            <p className="text-[15px] font-normal text-[#2F80ED] text-left p-2.5 w-full min-h-[60px]">
                                {label.content_title}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
