"use client";
import { env } from '@/config/env';
import { CheckOutlined } from '@ant-design/icons';
import { message, Modal, Input, Button, Tooltip } from 'antd';
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
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creating, setCreating] = useState(false);
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
    if (!currentPath) {
      message.error('Không thể trở về');
      return;
    }
    const parent = currentPath.split('/').slice(0, -1).join('/');
    fetchData(parent);
  };

  // const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(e.target.files || []);
  //   if (!files.length) return;

  //   const form = new FormData();
  //   files.forEach(f => form.append('files', f));
  //   form.append('folder', currentPath);

  //   await fetch(
  //     `${env.apiUrl}/folders/upload?folder=${encodeURIComponent(currentPath)}`,
  //     {
  //       method: 'POST',
  //       body: form
  //     }
  //   );

  //   e.target.value = '';
  //   fetchData(currentPath);
  // };
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // ✅ CHẶN FILE > 5MB TRƯỚC KHI GỬI
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const invalidFiles = files.filter(f => f.size > MAX_SIZE);

    if (invalidFiles.length > 0) {
      message.error(
        `${invalidFiles.map(f => f.name).join(', ')} vượt quá 5MB!`
      );
      e.target.value = ''; // Reset input
      return;
    }

    const form = new FormData();
    files.forEach(f => form.append('files', f));
    form.append('folder', currentPath);

    try {
      // setCreating(true); // Loading state
      const res = await fetch(
        `${env.apiUrl}/folders/upload?folder=${encodeURIComponent(currentPath)}`,
        {
          method: 'POST',
          body: form
        }
      );

      if (!res.ok) {
        const error = await res.json();
        message.error(error.message || 'Upload thất bại!');
        return;
      }

      message.success('Upload thành công!');
    } catch (error) {
      message.error('Lỗi kết nối!');
      console.error('Upload error:', error);
    } finally {
      // setCreating(false);
      e.target.value = '';
      fetchData(currentPath);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) {
      message.warning('Vui lòng nhập tên thư mục');
      return;
    }

    try {
      setCreating(true);

      const res = await fetch(`${env.apiUrl}/folders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent: currentPath,
          name: newFolderName.trim()
        })
      });

      const result = await res.json();

      if (!res.ok) {
        message.error(result.error || 'Tạo thư mục thất bại');
        return;
      }

      message.success('Tạo thư mục thành công 🎉');
      setIsCreateOpen(false);
      fetchData(currentPath);
    } catch (err) {
      message.error('Lỗi server');
    } finally {
      setCreating(false);
    }
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

  const submitRename = async () => {
    console.log('submitRename called');
    if (!renamingPath || !renameValue.trim()) {
      setRenamingPath(null);
      return;
    }

    try {
      const res = await fetch(`${env.apiUrl}/folders/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPath: renamingPath,
          newName: renameValue.trim()
        })
      });

      const result = await res.json();

      if (!res.ok) {
        message.error(result.error || 'Đổi tên thư mục thất bại');
        return;
      }

      message.success('Đổi tên thư mục thành công 🎉');

      setRenamingPath(null);
      fetchData(currentPath);
    } catch (err) {
      console.error(err);
      message.error('Lỗi server');
    }
  };


  const handleDelete = async (path: string) => {
    if (!confirm('Bạn chắc chắn muốn xóa?')) return;

    try {
      const res = await fetch(`${env.apiUrl}/folders/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ path }]
        })
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Xóa thất bại');
        return;
      }

      fetchData(currentPath);
    } catch (err) {
      console.error(err);
      alert('Lỗi server');
    }
  };


  /* ================= RENDER ================= */
  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
      <div
        className="bg-white max-w-7xl  h-[90vh] rounded-xl shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {/* ===== Toolbar ===== */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 text-sm bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setNewFolderName('');
                setIsCreateOpen(true);
              }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-600 hover:shadow-md border border-gray-200 transition-all duration-200 flex items-center gap-2"
            >
              📁 Thêm thư mục
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fileInputRef.current?.click()
              }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-green-50 hover:text-green-600 hover:shadow-md border border-gray-200 transition-all duration-200 flex items-center gap-2"
            >
              ⬆ Thêm ảnh
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goBack();
              }}
              disabled={!currentPath}
              className="px-3 py-2 rounded-lg text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 bg-white hover:bg-gray-50 hover:text-gray-800 hover:shadow-sm border border-gray-200 transition-all duration-200 flex items-center gap-2 disabled:border-gray-300"
            >
              ← Trở về
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
                onClick={() => {
                  if (renamingPath) return; // đang rename thì không cho navigate
                  goToFolder(folder.path);
                }}
                className="group px-3 py-2 rounded-xl cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 mb-1 font-medium flex items-center justify-between shadow-sm hover:shadow-md"
              >
                {/* LEFT: folder name */}
                <div className="flex items-center gap-2 truncate">
                  📁 {renamingPath === folder.path ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onClick={e => e.stopPropagation()}
                      onChange={e => setRenameValue(e.target.value)}
                      // onBlur={() => setRenamingPath(null)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') submitRename();
                        if (e.key === 'Escape') setRenamingPath(null);
                      }}
                      className="border px-2 py-1 rounded text-sm w-full"
                    />
                  ) : (
                    <span className="truncate">{folder.name}</span>
                  )}
                </div>

                {/* RIGHT: actions */}

                <div className="flex items-center gap-1">
                  {renamingPath === folder.path ? (
                    <>
                      {/* SAVE BUTTON */}
                      <Button
                        icon={<CheckOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          submitRename();
                        }}
                        className="group relative flex items-center justify-center !w-6 !h-6 !ml-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl border border-green-400/50 hover:border-green-500/80 rounded-xl transition-all duration-200 hover:scale-110 hover:rotate-0 active:scale-95 active:rotate-180 transform-gpu backdrop-blur-sm hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-1 focus:ring-offset-white ml-1"
                      />


                    </>
                  ) : (
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-all">
                      {/* RENAME */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          e.preventDefault();
                          setRenamingPath(folder.path);
                          setRenameValue(folder.name);
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
                          e.preventDefault();
                          handleDelete(folder.path);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-xs hover:bg-red-100 hover:text-red-600"
                        title="Xóa folder"
                      >
                        🗑
                      </button>
                    </div>
                  )}
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

                {
                  data.files.length === 0 ? <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-300 rounded-3xl bg-gradient-to-br from-gray-50 to-blue-50 hover:border-blue-300 transition-all duration-300">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                      <span className="text-3xl opacity-60">🖼️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Chưa có ảnh</h3>
                    <p className="text-gray-500 text-sm max-w-md text-center leading-relaxed">
                      📁 Nhấn "Thêm ảnh" ở toolbar để upload hình ảnh vào thư mục này
                    </p>
                    <div className="mt-6 text-xs text-gray-400 bg-white/60 px-4 py-2 rounded-xl border">
                      💡 Hỗ trợ JPG, PNG, WEBP (tối đa 5MB/file)
                    </div>
                  </div>
                    :
                    data.files.map(file => (


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

                        </div>

                        {/* INFO */}
                        <div className="px-2 pb-2">
                          {renamingPath === file.path ? (
                            <input
                              autoFocus
                              value={renameValue}
                              onChange={e => setRenameValue(e.target.value)}
                              // onBlur={() => setRenamingPath(null)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') submitRename();
                                if (e.key === 'Escape') setRenamingPath(null);
                              }}
                              className="border px-2 py-1 rounded text-sm w-full"
                            />
                          ) : (
                            <h4 className="text-sm font-bold truncate">
                              {file.name}
                            </h4>
                          )}
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

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />



      </div>
      <Modal
        open={isCreateOpen}
        onOk={createFolder}
        onCancel={() => setIsCreateOpen(false)}
        confirmLoading={creating}
        okText="Tạo"
        cancelText="Hủy"
        centered
        width={420}
        styles={{
          content: {
            borderRadius: 20,
            padding: 24
          },
          body: {
            padding: 12  // 👈 padding chính ở đây
          },
          header: {
            borderBottom: 'none'
          },
          footer: {
            padding: 12,
            borderTop: 'none'
          }
        }}
        okButtonProps={{
          className:
            "bg-blue-600 hover:bg-blue-700 border-none rounded-xl px-6 h-10 font-medium"
        }}
        cancelButtonProps={{
          className:
            "rounded-xl px-6 h-10 font-medium"
        }}
      >
        <div className="space-y-5">
          {/* Header custom */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-lg">
              📁
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Tạo thư mục mới
              </h3>

            </div>
          </div>

          {/* Input */}
          <Input
            autoFocus
            size="large"
            placeholder="Ví dụ: Hình ảnh sản phẩm"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onPressEnter={createFolder}
            className="rounded-xl h-11"
          />
        </div>
      </Modal>
    </div>

  );
}
