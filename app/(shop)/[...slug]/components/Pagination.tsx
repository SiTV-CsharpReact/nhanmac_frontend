import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  alias: string;
};

function getPageNumbers(page: number, totalPages: number) {
  const pages = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (page <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (page >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }
  }
  return pages;
}

export default function Pagination({ page, totalPages, alias }: PaginationProps) {
  const pages = getPageNumbers(page, totalPages);
  return (
    <nav className="flex justify-center items-center gap-2 mt-6 select-none" aria-label="Pagination">
      {/* Previous */}
      <Link
        href={`/${alias}?page=${page - 1}`}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition border border-blue-500 text-blue-600 ${
          page <= 1 ? "opacity-50 pointer-events-none" : "hover:bg-blue-100"
        }`}
        aria-disabled={page <= 1}
      >
        <span>&lt;</span>
       Trước
      </Link>

      {/* Page numbers */}
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-lg text-gray-400 select-none">
            ...
          </span>
        ) : (
          <Link
          key={`page-${p}`}
            href={`/${alias}?page=${p}`}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition border ${
              page === p
                ? "bg-blue-600 text-white border-blue-600"
                : "border-transparent text-blue-600 hover:bg-blue-50"
            }`}
            aria-current={page === p ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      <Link
        href={`/${alias}?page=${page + 1}`}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition border border-blue-500 text-blue-600 ${
          page >= totalPages ? "opacity-50 pointer-events-none" : "hover:bg-blue-100"
        }`}
        aria-disabled={page >= totalPages}
      >
        Sau
        <span>&gt;</span>
      </Link>
    </nav>
  );
}
