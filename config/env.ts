export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://backend.nhanmac.vn/api',
  uploadUrl: process.env.NEXT_PUBLIC_UPLOAD_URL || 'https://backend.nhanmac.vn/api/upload/image',
  host:process.env.NEXT_HOST_PAGE_URL ||'http://localhost:4000/',
  hostBackend:process.env.NEXT_HOST_BACKEND_URL ||'https://backend.nhanmac.vn'
} as const; 