
import PostNews from "@/components/share/PostNews";
import TitlePage from "@/components/share/TitlePage";
import { Post } from "@/types/contentItem";
import { fetchCateAlias, fetchContentBySlugId } from "@/modules/client/menuApi";
import { parseSlug, renderSlugUrl , normalizeSlug} from "../../../utils/util";
import Pagination from "./components/Pagination";
import CatePage from "./components/CatePage";
import { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import Loading from "@/components/share/Loading";
import { notFound} from 'next/navigation'; 
import { permanentRedirect } from 'next/navigation'
type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface PageData {
  isPostPage: boolean;
  postList: Post[];
  title: string;
  total?: number;
  totalPages?: number;
  alias: string;
}

// Helper function lấy dữ liệu trang
async function getPageData(
  slug: string,
  page: number = 1,
  pageSize: number = 9,
  callRedirect:boolean = true,
): Promise<PageData | null> {
  //  console.log(slug,'slug xịn')
  const { id, alias } = parseSlug(slug);
  const invalidFiles = ["favicon.ico", "upload", "sitemap.xml"];

  if (invalidFiles.includes(slug.toLowerCase()) || invalidFiles.includes(alias)) {
    return null;
  }

  if (id !== null) {
    // Trang bài viết chi tiết
    const { data } = await fetchContentBySlugId(alias, id);
    // console.log(data,'data')
    if(callRedirect){
      if(data?.Code == 404){
        notFound()
      }
      if (data?.Data?.correctUrl) {
        permanentRedirect(data.Data.correctUrl);
        // redirect(data.Data.correctUrl, { permanent: true });
      }
    }

    const post = data?.Data || data?.data?.article || ({} as Post);
    return {
      isPostPage: true,
      postList: [post],
      title: data?.Data?.parent_cat_name || "",
      alias
    };
  } else {
    // Trang danh mục
    const res = await fetchCateAlias(alias, page, pageSize);
    
    if (!res?.Data?.list?.length) {
      return null;
    }
    
    return {
      isPostPage: false,
      postList: res.Data.list,
      title: res.Data.list?.[0]?.category_title || "",
      total: res.Data.total || 0,
      totalPages: res.Data.totalPages || 0,
      alias
    };
  }
}

// Xử lý nội dung bài viết
function processPostContent(content?: string): string {
  if (!content) return "";
  
  return content
    .replace(/href="(?:index\.php\/)?[^"]*\/(\d+)-([a-zA-Z0-9\-]+)(?:\.html)?"/g, (match, id, slug) => `href="${slug}-${id}.html"`)
    .replace(/src="upload\/image\/([^"]+)"/g, (match, filename) => `src="${renderSlugUrl(filename)}"`)
    .replace(/(<img[^>]*?)\swidth="[^"]*"/g, '$1 width="100%"')
    .replace(/<img((?![^>]*width=)[^>]*)>/g, `<img$1 width="100%">`);
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const normalizeS = normalizeSlug(slug);
    // console.log(slug,'slug xịn 1')
    const { id, alias } = parseSlug(normalizeS);
    const sp = await searchParams;
    const page = parseInt((sp?.page as string) || "1");
    const pageSize = parseInt((sp?.pageSize as string) || "9");
    
    const pageData = await getPageData(normalizeS, page,pageSize,false);
    
    if (!pageData?.postList?.length) {
      return {
        title: "Không tìm thấy nội dung",
        description: "Nội dung không tồn tại"
      };
    }

    const firstPost = pageData.postList?.[0];
    const titlePageCate = pageData.title || "Công ty Cổ phần Công Nghệ Thiên Lương";
   
    const canonicalUrl = pageData.isPostPage 
    ? `https://nhanmac.vn/${alias}-${id}.html`
    : page > 1
      ? `https://nhanmac.vn/${pageData.alias}?page=${page}`
      : `https://nhanmac.vn/${pageData.alias}`;
    
    return {
      title: pageData.isPostPage 
        ? firstPost?.title || titlePageCate 
        : `${titlePageCate} - Công ty Cổ phần Công Nghệ Thiên Lương`,
      description: firstPost?.metadesc || titlePageCate,
      keywords: firstPost?.metakey || titlePageCate,
      openGraph: {
        title: firstPost?.title || titlePageCate,
        description: firstPost?.description || firstPost?.metadesc || titlePageCate,
        images: firstPost?.images ? [firstPost.images] : [],
        type: "article",
        url: `${alias}-${id}.html`,
      },
      twitter: {
        card: "summary_large_image",
        title: firstPost?.title || titlePageCate,
        description: firstPost?.metadesc || titlePageCate,
        images: firstPost?.images ? [firstPost.images] : [],
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
      icons: {
        icon: "https://nhanmac.vn/_next/image?url=/images/favicon.ico&w=64&q=75",
        apple: [
          { url: "https://nhanmac.vn/_next/image?url=/images/favicon.ico&w=64&q=75", sizes: "72x72" },
          { url: "https://nhanmac.vn/_next/image?url=/images/favicon.ico&w=64&q=75", sizes: "114x114" },
          { url: "https://nhanmac.vn/_next/image?url=/images/favicon.ico&w=64&q=75", sizes: "57x57" },
        ],
      },
    };
  } catch (error) {
    console.error("Lỗi khi tạo metadata:", error);
    return {
      title: "Trang chủ | Công ty chúng tôi",
      description: "Thông tin chi tiết"
    };
  }
}

export default async function Page({
  params,
  searchParams
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = parseInt((sp?.page as string) || "1");
  const pageSize = parseInt((sp?.pageSize as string) || "9");

  const pageData = await getPageData(normalizeSlug(slug), page, pageSize);
  
  if (!pageData || !pageData.postList?.length) {
    notFound()  
  }

  const firstPost = pageData.postList?.[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: firstPost?.title,
    image: firstPost?.images ? [firstPost.images] : [],
    datePublished: firstPost?.publish_up,
    dateModified: firstPost?.modified,
    author: { "@type": "Person", name: "Nhanmac" },
    publisher: {
      "@type": "Organization",
      name: firstPost?.title || pageData.title,
      logo: { "@type": "ImageObject", url: "/logo.png", width: 130, height: 60 }
    },
    description: firstPost?.metadesc,
  };

  return (
    <main className="mx-auto px-4">
      <div className="max-w-full md:max-w-7xl mx-auto mb-6">
        <TitlePage text={pageData.title} />
        <div className="flex flex-col md:flex-row gap-6">
          <article className="w-full md:w-2/3">
            {pageData.isPostPage ? (
              firstPost?.introtext ? (
                <Suspense fallback={<Loading />}>
                  <section
                    className="prose max-w-full"
                    dangerouslySetInnerHTML={{ __html: processPostContent(firstPost.introtext) }}
                  />
                </Suspense>
              ) : (
                <p className="text-gray-500">Đang cập nhật nội dung...</p>
              )
            ) : (
              <Suspense fallback={<Loading />}>
                <CatePage postList={pageData.postList} />
                <Pagination
                  page={page}
                  totalPages={pageData.totalPages || 0}
                  alias={pageData.alias}
                />
              </Suspense>
            )}
            <Script
              id="news-article-jsonld"
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
          </article>
          <aside className="w-full md:w-1/3 flex flex-col gap-6">
            <PostNews />
          </aside>
        </div>
      </div>
    </main>
  );
}
