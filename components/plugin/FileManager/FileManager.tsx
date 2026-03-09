import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AssetGrid from './components/AssetGrid';
import { Asset, DirectoryNode } from './types';
import { api, BackendFile, BackendFolder, TreeItem } from './api';
import {
  HomeOutlined, RightOutlined, AppstoreOutlined, UnorderedListOutlined,
  CloseSquareOutlined, DeleteOutlined, CheckCircleFilled,
} from '@ant-design/icons';
import './FM.css'
import { notification } from 'antd';

interface FileManager {
  onSelect:(url:string | undefined ,name:string)=>void;
  onClose: () => void;
}
const notifySuccess = (msg: string) => {
  notification.success({
    message: 'Thành công',
    description: msg,
    placement: 'bottomRight'
  });
};

const notifyError = (msg: string) => {
  notification.error({
    message: 'Lỗi',
    description: msg,
    placement: 'bottomRight'
  });
};
const FileManager: React.FC<FileManager> = ({onSelect,
  onClose,
  // currentFolder = ''
}) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string>(''); // Empty string for root
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarTree, setSidebarTree] = useState<DirectoryNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingFolder, setCreatingFolder] = useState(false);

  // Helper to convert BackendFolder/File to Asset
  const mapToAsset = (item: BackendFile | BackendFolder, type: 'folder' | 'image', parentPath: string): Asset => ({
    id: item.path, // Use path as ID
    name: item.name,
    type,
    parentId: parentPath,
    size: (item as BackendFile).size,
    url: (item as BackendFile).url,
    itemsCount: 0 // Backend doesn't provide this yet
  });

  // Fetch Sidebar Tree
  const fetchTree = useCallback(async () => {
    try {
      const treeData = await api.getTree();
      // Map TreeItem to DirectoryNode if needed, or match types
      // TreeItem matches DirectoryNode structure roughly
      setSidebarTree(treeData as unknown as DirectoryNode[]);
    } catch (err) {
      console.error('Failed to fetch tree:', err);
    }
  }, []);

  // Fetch Assets for current folder
  const fetchAssets = useCallback(async (folderPath: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.list(folderPath);

      const folderAssets = res.folders.map(f => mapToAsset(f, 'folder', folderPath));
      const fileAssets = res.files.map(f => mapToAsset(f, 'image', folderPath));

      setAssets([...folderAssets, ...fileAssets]);

    } catch (err) {
      console.error('Failed to fetch assets:', err);
      setError('Failed to load folder contents');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync when folder changes
  useEffect(() => {
    if (!searchQuery) {
      fetchAssets(currentFolderId);
    }
  }, [currentFolderId, fetchAssets, searchQuery]);

  // Initial load
  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  // Search
  useEffect(() => {
    if (searchQuery.trim()) {
      setLoading(true);
      api.search(searchQuery, currentFolderId)
        .then(res => {
          const fileAssets = res.files.map((f: BackendFile) => mapToAsset(f, 'image', 'search_result'));
          setAssets(fileAssets);
        })
        .catch(err => {
          console.error("Search error", err);
          setError("Search failed");
        })
        .finally(() => setLoading(false));
    } else {
      fetchAssets(currentFolderId);
    }
  }, [searchQuery, currentFolderId, fetchAssets]);


  // Breadcrumb path calculation
  const currentPath = useMemo(() => {
    if (!currentFolderId) return [];
    // path parts
    const parts = currentFolderId.split('/').filter(Boolean);
    const path: string[] = [];
    let current = '';

    return parts.map(part => {
      current = current ? `${current}/${part}` : part;
      return current;
    });
  }, [currentFolderId]);

  const breadcrumbs = useMemo(() => {
    if (!currentFolderId) return [];

    const parts = currentFolderId.split('/').filter(Boolean);
    let accumulatedPath = '';

    return parts.map(part => {
      accumulatedPath = accumulatedPath ? `${accumulatedPath}/${part}` : part;
      return {
        id: accumulatedPath,
        name: part,
        type: 'folder' as const,
        parentId: null // Not needed for breadcrumb display
      };
    });
  }, [currentFolderId]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleNavigate = (folderId: string | null) => {
    setCurrentFolderId(folderId || '');
    setSearchQuery('');
    setSelectedIds(new Set()); // Clear selection on navigation
  };

  const handleToggleSelection = (id: string, multiSelect: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(multiSelect ? prev : []);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;

    if (confirm(`Bạn có chắc muốn xóa ${selectedIds.size} mục?`)) {
      try {
        const itemsToDelete = Array.from(selectedIds).map(id => ({ path: id }));
        await api.delete(itemsToDelete);
        notifySuccess(`Đã xóa ${selectedIds.size} mục`);
        setSelectedIds(new Set());
        fetchAssets(currentFolderId);
        fetchTree();
      } catch (e: any) {
        notifyError('Xóa hàng loạt thất bại: ' + e.message);
      }
    }
  };


  const handleCreateFolder = () => {
    setCreatingFolder(true);
  };

  const handleConfirmCreateFolder = async (name: string) => {
    setCreatingFolder(false);
    try {
      await api.createFolder(name, currentFolderId);
      notifySuccess('Tạo folder thành công');

      fetchAssets(currentFolderId);
      fetchTree();
    } catch (e: any) {
      notifySuccess('Tạo folder thành công');

    }
  };

  const handleUpload = () => {
    // This will be handled by Header triggering a click on hidden input
    // We need to pass the actual handler 'onFilesSelected' to Header
  };

  const onFilesSelected = async (files: File[]) => {
    try {
      await api.upload(files, currentFolderId);
      fetchAssets(currentFolderId);
      notifySuccess('Upload file thành công');
    } catch (e: any) {
      notifyError('Upload thất bại: ' + e.message);
    }
  };

  const handleAssetAction = async (id: string, action: 'delete' | 'edit') => {
    if (action === 'delete') {
      if (confirm('Bạn có chắc muốn xóa ảnh này?')) {
        try {
          await api.delete([{ path: id }]);
          notifySuccess('Xóa file thành công');
          fetchAssets(currentFolderId);
          fetchTree();
        } catch (e: any) {
          notifyError('Xóa thất bại: ' + e.message);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
     <div className="w-full max-w-[1400px] min-w-[1400px] h-[860px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/20 ring-1 ring-black/5">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateFolder={handleCreateFolder}
        onUpload={() => { }} // Header should handle the click, we pass handler via onFilesSelected
        onFilesSelected={onFilesSelected}
        onClose={onClose}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          assets={assets}
          tree={sidebarTree}
          currentPath={currentPath}
          onNavigate={handleNavigate}
          onFolderRenamed={(_oldPath, _newName) => { fetchTree(); fetchAssets(currentFolderId); }}
          onFolderDeleted={(path) => { fetchTree(); if (currentFolderId === path || currentFolderId.startsWith(path + '/')) { handleNavigate(null); } else { fetchAssets(currentFolderId); } }}
          creatingFolder={creatingFolder}
          onConfirmCreate={handleConfirmCreateFolder}
          onCancelCreate={() => setCreatingFolder(false)}
        />

        <main className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Main Controls Header */}
          <div className="flex items-center justify-between px-6 py-1 border-b border-[#f2f2f2] bg-white sticky top-0 z-20">
            <div className="flex items-center gap-2 overflow-hidden">
              <button
                onClick={(e)=>{
                  e.stopPropagation();
                  e.preventDefault();
                  handleNavigate(null)}}
                className="text-[#757575] text-sm font-medium hover:text-black flex items-center gap-1 shrink-0"
              >
                <HomeOutlined className="text-base" />
                Home
              </button>
              {breadcrumbs.map((folder, idx) => (
                <React.Fragment key={folder.id}>
                  <RightOutlined className="text-xs text-[#ccc] shrink-0" />
                  <button
                    onClick={() => handleNavigate(folder.id)}
                    className={`text-sm truncate ${idx === breadcrumbs.length - 1 ? 'text-black font-bold' : 'text-[#757575] font-medium hover:text-black'}`}
                  >
                    {folder.name}
                  </button>
                </React.Fragment>
              ))}
              {searchQuery && (
                <>
                  <RightOutlined className="text-xs text-[#ccc] shrink-0" />
                  <span className="text-blue-600 text-sm font-bold truncate">Tìm kiếm: "{searchQuery}"</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <p className="text-xs text-[#757575] font-medium">Hiển thị {assets.filter(a => a.type === 'image').length} ảnh</p>
              {/* <div className="flex items-center bg-[#f2f2f2] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-[#757575] hover:text-black'}`}
                >
                  <AppstoreOutlined className="text-base leading-none" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-[#757575] hover:text-black'}`}
                >
                  <UnorderedListOutlined className="text-base leading-none" />
                </button>
              </div> */}
            </div>
          </div>

          {/* Grid View */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-400">Đang tải...</div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-red-500">{error}</div>
            ) : (
              <AssetGrid
                assets={assets}
                viewMode={viewMode}
                selectedIds={selectedIds}
                onNavigate={handleNavigate}
                onAssetAction={handleAssetAction}
                onToggleSelection={handleToggleSelection}
                onTestSelect={onSelect}
              />
            )}

          </div>

          {/* Footer Bar */}
          <footer className="h-12 border-t border-[#f2f2f2] flex items-center justify-between px-8 bg-[#fcfcfc] shrink-0">
            <div className="flex items-center gap-4">
              {selectedIds.size > 0 ? (
                <>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.15em]">{selectedIds.size} đã chọn</p>
                  <div className="h-3 w-[1px] bg-[#e5e5e5]"></div>
                  <button
                  onClick={(e)=>{
                    e.stopPropagation();
                    e.preventDefault();
                    setSelectedIds(new Set())}}
    
                    className="text-xs !text-[#757575] font-semibold hover:text-black flex items-center gap-1"
                  >
                    <CloseSquareOutlined className="text-sm" />
                    Bỏ chọn tất cả
                  </button>
                  <div className="h-3 w-[1px] bg-[#e5e5e5]"></div>
                  <button
                   onClick={(e)=>{
                    e.stopPropagation();
                    e.preventDefault();
                    handleBatchDelete()}}
                    // onClick={handleBatchDelete}
                    className="text-xs !text-red-500 font-semibold hover:text-red-700 flex items-center gap-1"
                  >
                    <DeleteOutlined className="text-sm" />
                    Xóa mục đã chọn
                  </button>

                </>
              ) : (
                <>
                  <p className="text-[10px] text-[#757575] font-bold uppercase tracking-[0.15em]">{assets.length} mục</p>
                  <div className="h-3 w-[1px] bg-[#e5e5e5]"></div>
                  <p className="text-[11px] text-[#757575] font-medium">Đã đồng bộ với Server</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleFilled className="text-sm !text-green-500" />
              <p className="text-[11px] text-[#757575] font-semibold">Kết nối Server</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
    </div>
  );
};

export default FileManager;
