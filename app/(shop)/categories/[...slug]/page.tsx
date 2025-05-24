import PostNews from "@/components/share/PostNews";
import TitlePage from "@/components/share/TitlePage";
import { Post } from "@/types/contentItem";
import { Metadata, ResolvingMetadata } from "next";
import { fetchCateAlias } from "@/modules/client/menuApi";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: {
    slug: string[];
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   try {
//     const [category = '', id = ''] = params.slug || [];

//     // Gọi API lấy chi tiết nội dung
//     const res = await fetchContentAlias(category);
//     const post: Post = res?.Data;
//     // Nếu không có dữ liệu
//     if (!post) {
//       return {
//         title: "Sản phẩm không tồn tại",
//         description: "Không tìm thấy thông tin sản phẩm",
//       };
//     }

//     return {
//       title: post?.title || `Sản phẩm ${id}`,
//       description: post?.metadesc || `Chi tiết sản phẩm mã ${id}`,
//       keywords: post?.metakey || '',
//       openGraph: {
//         title: post.title,
//         description: post.metadesc || '',
//         images: post.urls ? [post.urls] : undefined,
//       },
//     };
//   } catch (error) {
//     console.error("Lỗi khi tạo metadata:", error);
//     return {
//       title: "Sản phẩm | Công ty chúng tôi",
//       description: "Thông tin chi tiết về sản phẩm",
//     };
//   }
// }

export default async function Page({ params }: Props) {
  const [category = '', rawId = ''] = params?.slug || [];
  // const id = category.replace(/\.html$/, ''); // 🔥 loại bỏ .html
  // console.log('id',id)
 // Loại bỏ .html nếu có
 const cleanSlug = category.replace(/\.html$/, '');

 // Tìm số ở cuối slug
//  const match = cleanSlug.match(/-(\d+)$/); // Ví dụ: ao-thun-123

 const alias = cleanSlug || null; // nếu có thì dùng số, không thì null
//  const alias = match ? null : cleanSlug;     // nếu không có số thì dùng alias

  let post: Post[];
  try {
    let res;
   if(alias != null) {
    res = await fetchCateAlias(alias);
    post = res.Data;
    if (!post) {
      redirect('/not-found');
    }
   }
  
  } catch (error) {
    console.log(error)
  }

  return (
    <main className="m-auto grid place-items-center">
      <div className="container mb-15">
        {/* Tiêu đề */}
        <TitlePage/>

        <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-6">
          {/* Nội dung chính */}
          <article className="w-full md:w-2/3">
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {post?.map((item) => (
                  <Link href={`/products/${item.alias}-${item.id}`}>
                  
                  <div key={item.id} className="bg-white shadow rounded p-4 hover:shadow-md transition">
                    <img
                      src={item.urls || "/images/default.jpg"}
                      alt={item.content_title}
                      className="w-full h-48 object-cover mb-3 rounded"
                    />
                    <h3 className=" text-sm font-normal leading-5 line-clamp-2 text-[#2F80ED]">{item.content_title}</h3>

                  </div>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full md:w-1/3 flex flex-col gap-6">
            <PostNews />
          </aside>
        </div>
      </div>
    </main>
  );
}