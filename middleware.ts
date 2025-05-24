// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Kiểm tra xem có truy cập trang admin không
  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('access_token')?.value;
    
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'], // áp dụng cho tất cả route bắt đầu bằng /admin
};