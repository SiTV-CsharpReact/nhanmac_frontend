'use client';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
export default function HeaderAdmin() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("access_token"); // Xóa token
    router.push("/login");   
  };

  return (
    <header className="w-full flex items-center justify-between bg-white shadow px-6 py-3 mb-4">
      <div className="text-xl font-bold text-blue-600">Quản trị hệ thống</div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Chào, Admin</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 !text-white text-sm rounded hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
