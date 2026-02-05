"use client";
import { env } from '@/config/env';
import { useState, useRef, useCallback, useEffect } from 'react';

interface FileItem {
  name: string;
  url: string;
  size: number;
  path: string;
}

interface FolderItem {
  name: string;
  path: string;
}

interface ApiResponse {
  folders: FolderItem[];
  files: FileItem[];
  currentFolder: string;
}

export default function FileManager({
  onSelect,
  onClose,
  currentFolder = ''
}: {
  onSelect: (url: string, name: string) => void;
  onClose: () => void;
  currentFolder?: string;
}) {
  const [data, setData] = useState<ApiResponse>({
    folders: [],
    files: [],
    currentFolder: ''
  });
  const [currentPath, setCurrentPath] = useState(currentFolder);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ================= FETCH ================= */
  const fetchData = useCallback(async (folder: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${env.apiUrl}/folders/list?folder=${encodeURIComponent(folder)}`
      );
      const json = await res.json();
      setData(json);
      setCurrentPath(json.currentFolder || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentFolder);
  }, [fetchData, currentFolder]);

  /* ================= ACTIONS ================= */
  const goToFolder = (path: string) => fetchData(path);

  const goBack = () => {
    if (!currentPath) return;
    const parent = currentPath.split('/').slice(0, -1).join('/');
    fetchData(parent);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const form = new FormData();
    files.forEach(f => form.append('files', f));
    form.append('folder', currentPath);

    await fetch(
      `${env.apiUrl}/folders/upload?folder=${encodeURIComponent(currentPath)}`,
      {
        method: 'POST',
        body: form
      }
    );

    e.target.value = '';
    fetchData(currentPath);
  };

  const createFolder = async () => {
    const name = prompt('Tên folder mới?');
    if (!name) return;

    await fetch(`${env.apiUrl}/folders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parent: currentPath,
        name
      })
    });

    fetchData(currentPath);
  };

  const deleteItems = async (items: { path: string }[]) => {
    if (!confirm('Xóa mục này?')) return;

    await fetch(`${env.apiUrl}/folders/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });

    fetchData(currentPath);
  };

  /* ================= RENDER ================= */
  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
      <div
        className="bg-white max-w-7xl  h-[90vh] rounded-xl shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* ===== Toolbar ===== */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 text-sm bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <button
              onClick={createFolder}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-600 hover:shadow-md border border-gray-200 transition-all duration-200 flex items-center gap-2"
            >
              📁 New folder
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-green-50 hover:text-green-600 hover:shadow-md border border-gray-200 transition-all duration-200 flex items-center gap-2"
            >
              ⬆ Upload image
            </button>

            <button
              onClick={goBack}
              disabled={!currentPath}
              className="px-3 py-2 rounded-lg text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 bg-white hover:bg-gray-50 hover:text-gray-800 hover:shadow-sm border border-gray-200 transition-all duration-200 flex items-center gap-2 disabled:border-gray-300"
            >
              ← Back
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-xl font-bold ml-auto"
          >
            ✕
          </button>
        </div>

        {/* ===== Body ===== */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 border-r border-gray-200 p-4 overflow-y-auto text-sm bg-gradient-to-b from-white to-gray-50">
            <div className="font-semibold mb-4 text-lg text-gray-800 pb-2 border-b border-gray-200">
              📁 {currentPath || 'Root'}
            </div>

            {data.folders.map(folder => (
              <div
                key={folder.path}
                onClick={() => goToFolder(folder.path)}
                className="group px-3 py-2 rounded-xl cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 mb-1 font-medium flex items-center justify-between shadow-sm hover:shadow-md"
              >
                {/* LEFT: folder name */}
                <div className="flex items-center gap-2 truncate">
                  📁 <span className="truncate">{folder.name}</span>
                </div>

                {/* RIGHT: actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  {/* RENAME */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      const newName = prompt('Tên mới?', folder.name);
                      if (!newName) return;

                      fetch(`${env.apiUrl}/folders/rename`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          path: folder.path,
                          name: newName
                        })
                      }).then(() => fetchData(currentPath));
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-xs hover:bg-yellow-100 hover:text-yellow-600"
                    title="Đổi tên"
                  >
                    ✏️
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteItems([{ path: folder.path }]);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-xs hover:bg-red-100 hover:text-red-600"
                    title="Xóa folder"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </aside>


          {/* Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <div className="text-lg font-medium text-gray-600">Đang tải...</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {/* {data.files.map(file => (
              <div
                key={file.path}
                className=" hover:shadow-xl hover:border-blue-500 hover:shadow-lg cursor-pointer group relative bg-white transition-all duration-300 overflow-hidden"
                onClick={() => onSelect(file.url, file.name)}
              >
                <div className="relative overflow-hidden rounded-lg h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <img
                    src={file.url}
                    className="w-full h-full object-cover"
                    alt={file.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="text-xs mt-2 font-medium text-gray-800 truncate line-clamp-2 leading-tight">
                  {file.name}
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    deleteItems([{ path: file.path }]);
                  }}
                  className="absolute cursor-pointer -top-2 -right-2 w-8 h-8 bg-gray-200 text-white text-xs rounded opacity-0 group-hover:opacity-100 hover:bg-blue-400 shadow-lg border-2 border-white transition-all duration-200 flex items-center justify-center"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            ))} */}
                {data.files.map(file => (
                  <div
                    key={file.path}
                    onClick={() => onSelect(file.url, file.name)}
                    className="group relative cursor-pointer select-none transition-all duration-300 rounded-2xl hover:bg-gray-50"
                  >
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-2 relative border-2 transition-all duration-500 shadow-sm group-hover:shadow-xl border-transparent bg-gray-50 group-hover:border-blue-200">

                      {/* IMAGE */}
                      <div className="w-full h-full relative overflow-hidden">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteItems([{ path: file.path }]);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:scale-110 z-20 shadow-lg"
                        title="Delete item"
                      >
                        ✕
                      </button>
                    </div>

                    {/* INFO */}
                    <div className="px-2 pb-2">
                      <h4 className="text-sm font-bold text-gray-800 truncate transition-colors group-hover:text-blue-600">
                        {file.name}
                      </h4>
                      <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        /> */}
      </div>
    </div>

  );
}
