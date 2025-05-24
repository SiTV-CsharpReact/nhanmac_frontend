export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3600/api',
  uploadUrl: process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:3600/api/upload/image',
  host:process.env.NEXT_HOST_PAGE_URL ||'http://localhost:4000/',
    hostBackend:process.env.NEXT_HOST_BACKEND_URL ||'http://localhost:3600'
} as const; 