import { MetadataRoute } from 'next';

const BASE_URL = 'https://nhanmac.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1️⃣ Trang tĩnh
  const staticUrls = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tin-tong-hop`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      priority: 0.8,
    },
  ];

  // 2️⃣ Fetch bài viết / sản phẩm từ backend Joomla
//   const res = await fetch(
//     'https://backend.nhanmac.vn/api/news?limit=10000',
//     {
//       cache: 'force-cache', // ⚠️ BUILD TIME
//     }
//   );

//   const data = await res.json();

//   const postUrls = data.map((item: any) => ({
//     url: `${BASE_URL}/${item.slug}-${item.id}.html`,
//     lastModified: new Date(item.updated_at),
//     priority: item.is_hot ? 0.8 : 0.64,
//   }));

//   // 3️⃣ Trang phân trang
//   const pageUrls = Array.from({ length: 13 }).map((_, i) => ({
//     url: `${BASE_URL}/tin-tong-hop?page=${i}`,
//     lastModified: new Date(),
//     priority: i === 0 ? 0.8 : 0.64,
//   }));

  return [
    ...staticUrls,
    // ...postUrls,
    // ...pageUrls,
  ];
}
