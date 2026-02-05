export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'https://backend.nhanmac.vn/api',
  uploadUrl: process.env.NEXT_PUBLIC_UPLOAD_URL ?? 'https://backend.nhanmac.vn/api/upload/image',
  host: process.env.NEXT_PUBLIC_HOST_PAGE_URL ?? 'https://nhanmac.vn/',
  hostBackend: process.env.NEXT_PUBLIC_HOST_BACKEND_URL ?? 'https://backend.nhanmac.vn',
  flmngrApiKey: "KRXerKattudo7vg0PjFK9pKB"
} as const;
