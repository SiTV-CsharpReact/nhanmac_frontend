import Loading from "@/components/share/Loading";
import PostNews from "@/components/share/PostNews";
import TitlePage from "@/components/share/TitlePage";
import { fetchCateAlias, fetchContentBySlugId } from "@/modules/client/menuApi";
import { Post } from "@/types/contentItem";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Script from "next/script";
import { Suspense } from "react";
import {
  extractIdAndSlug,
  normalizeSlug,
  renderSlugUrl,
} from "../../../utils/util";
import CatePage from "./components/CatePage";
import Pagination from "./components/Pagination";

/* ================= TYPES ================= */

type Params = {
    slug: string[];
};

type SearchParams = {
    [key: string]: string | string[] | undefined;
};

interface PageData {
    isPostPage: boolean;
    postList: Post[];
    title: string;
    alias: string;
    canonicalSlug?: string;
    total?: number;
    totalPages?: number;
}

/* ================= DATA ================= */

async function getPageData(
  slugParam: string[],
  page = 1,
  pageSize = 9,
): Promise<PageData | null> {
  const lastSlug = normalizeSlug(slugParam.at(-1)!);

  // chặn file hệ thống
  if (["favicon.ico", "sitemap.xml", "robots.txt"].includes(lastSlug)) {
    return null;
  }

  const postResult = extractIdAndSlug(lastSlug);

  /* ========= POST DETAIL ========= */
  if (postResult) {
    const { id, alias } = postResult;

    const { data } = await fetchContentBySlugId(alias, id);
    if (!data || data.Code === 404) return null;

    const post = data.Data;

    return {
      isPostPage: true,
      postList: [post],
      title: post.parent_cat_name || "",
      alias,
      canonicalSlug: `${post.alias}-${post.id}.html`,
    };
  }

  /* ========= CATEGORY ========= */
  const res = await fetchCateAlias(lastSlug, page, pageSize);
  if (!res?.Data?.list?.length) return null;

  return {
    isPostPage: false,
    postList: res.Data.list,
    title: res.Data.list[0]?.category_title || "",
    alias: lastSlug, // ✅ FIX Ở ĐÂY
    total: res.Data.total,
    totalPages: res.Data.totalPages,
  };
}


/* ================= CONTENT PROCESS ================= */

function processPostContent(content?: string): string {
    if (!content) return "";

    return (
        content
            // Joomla legacy links → flat SEO link
            .replace(
                /href="index\.php\/[^"]*?\/(\d+)-([^"/]+)"/g,
                (_, id, slug) => `href="/${slug}-${id}.html"`,
            )
            // thiếu .html
            .replace(
                /href="([^"/]+)-(\d+)"/g,
                (_, slug, id) => `href="/${slug}-${id}.html"`,
            )
            // image path
            .replace(
                /src="upload\/image\/([^"]+)"/g,
                (_, file) => `src="${renderSlugUrl(file)}"`,
            )
            // img responsive
            .replace(/(<img[^>]*?)\swidth="[^"]*"/g, '$1 width="100%"')
            .replace(/<img((?![^>]*width=)[^>]*)>/g, '<img$1 width="100%">')
    );
}

/* ================= METADATA ================= */

export async function generateMetadata({
    params,
    searchParams,
}: {
    params: Params;
    searchParams: SearchParams;
}): Promise<Metadata> {
    const page = Number(searchParams.page ?? 1);
    const pageSize = Number(searchParams.pageSize ?? 9);

    const data = await getPageData(params.slug, page, pageSize);
    if (!data) return { title: "Không tìm thấy nội dung" };

    const post = data.postList[0];

    return {
        title: data.isPostPage
            ? post.title
            : `${data.title} - Công ty Cổ phần Công Nghệ Thiên Lương`,

        description: post?.metadesc || data.title,

        keywords: post?.metakey || data.title,

        alternates: {
            canonical: data.isPostPage
                ? `https://nhanmac.vn/${data.canonicalSlug}`
                : `https://nhanmac.vn/${data.alias}`,
        },

        openGraph: data.isPostPage
            ? {
                  type: "article",
                  title: post.title,
                  description: post.description || post.metadesc || data.title,
                  url: `https://nhanmac.vn/${data.canonicalSlug}`,
                  siteName: "Nhanmac",
                  images: post.images
                      ? [post.images]
                      : [
                            {
                                url: "https://nhanmac.vn/images/og-default.jpg",
                                width: 1200,
                                height: 630,
                            },
                        ],
              }
            : {
                  type: "website",
                  title: data.title,
                  description: data.title,
                  url: `https://nhanmac.vn/${data.alias}`,
                  siteName: "Nhanmac",
              },

        twitter: {
            card: "summary_large_image",
            title: post?.title || data.title,
            description: post?.metadesc || data.title,
            images: post?.images ? [post.images] : [],
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
            },
        },

        // icons: {
        //   icon: "/images/favicon.ico",
        //   apple: [
        //     { url: "/images/favicon.ico", sizes: "72x72" },
        //     { url: "/images/favicon.ico", sizes: "114x114" },
        //     { url: "/images/favicon.ico", sizes: "57x57" },
        //   ],
        // },
    };
}

/* ================= PAGE ================= */

export default async function Page({
    params,
    searchParams,
}: {
    params: Params;
    searchParams: SearchParams;
}) {
    const page = Number(searchParams.page ?? 1);
    const pageSize = Number(searchParams.pageSize ?? 9);

    const pageData = await getPageData(params.slug, page, pageSize);
    if (!pageData) notFound();

    /* ========= CANONICAL REDIRECT ========= */
    const currentLast = params.slug.at(-1);
    if (
        pageData.isPostPage &&
        pageData.canonicalSlug &&
        currentLast !== pageData.canonicalSlug
    ) {
        permanentRedirect(`/${pageData.canonicalSlug}`);
    }

    const post = pageData.postList[0];

    const jsonLd = pageData.isPostPage
        ? {
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              headline: post.title,
              image: post.images ? [post.images] : [],
              datePublished: post.publish_up,
              dateModified: post.modified,
              author: { "@type": "Organization", name: "Nhanmac" },
          }
        : null;

    return (
        <main className="mx-auto px-4">
            <div className="max-w-7xl mx-auto mb-6">
                <TitlePage text={pageData.title} />

                <div className="flex flex-col md:flex-row gap-6">
                    <article className="w-full md:w-2/3">
                        {pageData.isPostPage ? (
                            <section
                                className="prose max-w-full"
                                dangerouslySetInnerHTML={{
                                    __html: processPostContent(post.introtext),
                                }}
                            />
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

                        {jsonLd && (
                            <Script
                                id="jsonld"
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{
                                    __html: JSON.stringify(jsonLd),
                                }}
                            />
                        )}
                    </article>

                    <aside className="w-full md:w-1/3">
                        <Suspense fallback={<Loading />}>
                            {/* @ts-expect-error Async Server Component */}
                            <PostNews />
                        </Suspense>
                    </aside>
                </div>
            </div>
        </main>
    );
}
