
import React, { useState, useRef, useEffect } from 'react';
import { Asset } from '../types';
import Tooltip from './Tooltip';
import {
  FullscreenOutlined, LinkOutlined, DownloadOutlined, DeleteOutlined,
  FileImageOutlined, CheckOutlined, EllipsisOutlined,
} from '@ant-design/icons';

interface AssetGridProps {
  assets: Asset[];
  viewMode: 'grid' | 'list';
  selectedIds: Set<string>;
  onNavigate: (folderId: string) => void;
  onAssetAction: (id: string, action: 'delete' | 'edit') => void;
  onToggleSelection: (id: string, multiSelect: boolean) => void;
  onTestSelect: (url: string | undefined, name: string) => void;
}

const formatBytes = (bytes: number | string | undefined): string => {
  if (bytes === undefined || bytes === null) return '';
  if (typeof bytes === 'string') return bytes;
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// ─── Dropdown Menu ────────────────────────────────────────────────────────────
interface DropdownMenuProps {
  asset: Asset;
  onDelete: () => void;
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ asset, onDelete, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (asset.url) {
      navigator.clipboard.writeText(asset.url).then(() => {
        alert('Đã sao chép link ảnh!');
      });
    }
    onClose();
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (asset.url) {
      const a = document.createElement('a');
      a.href = asset.url;
      a.download = asset.name;
      a.target = '_blank';
      a.click();
    }
    onClose();
  };

  const handleViewFull = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (asset.url) window.open(asset.url, '_blank');
    onClose();
  };

  return (
    <div
      ref={ref}
      onClick={e => e.stopPropagation()}
      className="absolute bottom-full right-0 mb-2 z-50 bg-white border border-[#e8e8e8] rounded-xl shadow-xl py-1.5 min-w-[175px] text-sm overflow-hidden"
    >
      {/* Preview strip */}
      {asset.url && (
        <div
          className="mx-2 mb-1.5 h-20 rounded-lg bg-cover bg-center border border-[#f0f0f0]"
          style={{ backgroundImage: `url(${asset.url})` }}
        />
      )}

      <button
       onClick={(e)=>{
        e.stopPropagation();
        e.preventDefault();
        handleViewFull}}
        // onClick={handleViewFull}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#f5f5f5] text-[#222] transition-colors"
      >
        <FullscreenOutlined className="text-[15px] text-[#555]" />
        Xem ảnh gốc
      </button>

      <button
       onClick={(e)=>{
        e.stopPropagation();
        e.preventDefault();
        handleCopyLink}}
        // onClick={handleCopyLink}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#f5f5f5] text-[#222] transition-colors"
      >
        <LinkOutlined className="text-[15px] text-[#555]" />
        Sao chép link
      </button>

      <button
       onClick={(e)=>{
        e.stopPropagation();
        e.preventDefault();
        handleDownload}}
        // onClick={handleDownload}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#f5f5f5] text-[#222] transition-colors"
      >
        <DownloadOutlined className="text-[15px] text-[#555]" />
        Tải xuống
      </button>

      <div className="my-1 border-t border-[#f0f0f0]" />

      <button
        onClick={e => { e.stopPropagation();  e.preventDefault(); onDelete(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-red-50 text-red-500 transition-colors"
      >
        <DeleteOutlined className="text-[15px]" />
        Xóa ảnh
      </button>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AssetGrid: React.FC<AssetGridProps> = ({ assets, viewMode, selectedIds, onNavigate, onAssetAction, onToggleSelection, onTestSelect }) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter: only images (no folders)
  const images = assets.filter(a => a.type === 'image');

  if (images.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#757575] py-20">
        <FileImageOutlined className="text-6xl mb-4 opacity-20" />
        <p className="text-lg font-medium">Thư mục này chưa có ảnh nào</p>
        <p className="text-sm">Hãy tải ảnh mới lên để bắt đầu.</p>
      </div>
    );
  }

  const handleCheckboxClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onToggleSelection(id, true);
  };

  // ── List View ────────────────────────────────────────────────────────────────
  if (viewMode === 'list') {
    return (
      <div className="w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#f2f2f2] text-[#757575] text-xs uppercase tracking-wider">
              <th className="py-3 px-4 w-8"></th>
              <th className="py-3 px-4 font-semibold w-1/2">Tên</th>
              <th className="py-3 px-4 font-semibold">Kích thước</th>
              <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {images.map((asset) => {
              const isSelected = selectedIds.has(asset.id);
              const menuOpen = openMenuId === asset.id;
              return (
                <tr
                  key={asset.id}
                  className={` group border-b border-[#f2f2f2] transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}

                >
                  <td className="py-3 px-4">
                    <div
                     onClick={(e)=>{
                      e.stopPropagation();
                      e.preventDefault();
                      handleCheckboxClick(e, asset.id)}}
                      // onClick={(e) => handleCheckboxClick(e, asset.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                    >
                      {isSelected && <CheckOutlined className="text-white text-xs font-bold leading-none" />}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="cursor-pointer w-10 h-10 rounded-lg ..."
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (asset.url) onTestSelect(asset.url, asset.name);
                        }}
                        style={{ backgroundImage: `url(${asset.url})` }}
                      />
                      <span className={`text-sm font-medium truncate max-w-[300px] ${isSelected ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-600'}`}>
                        {asset.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{formatBytes(asset.size)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity relative">
                      <Tooltip text="Xem ảnh">
                        <button
                          type='button'
                          onClick={(e) => { e.stopPropagation(); if (asset.url) window.open(asset.url, '_blank'); }}
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                        >
                          <FullscreenOutlined className="text-base" />
                        </button>
                      </Tooltip>
                      <Tooltip text="Tải xuống">
                        <button
                          type='button'
                          onClick={(e) => { e.stopPropagation(); if (asset.url) { const a = document.createElement('a'); a.href = asset.url; a.download = asset.name; a.click(); } }}
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                        >
                          <DownloadOutlined className="text-base" />
                        </button>
                      </Tooltip>
                      <Tooltip text="Xóa ảnh">
                        <button
                        type='button'
                          onClick={(e) => { e.stopPropagation(); onAssetAction(asset.id, 'delete'); }}
                          className="p-1.5 hover:bg-red-50 rounded text-red-500"
                        >
                          <DeleteOutlined className="text-base" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Grid View ────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-4 gap-6">
      {images.map((asset) => {
        const isSelected = selectedIds.has(asset.id);
        const menuOpen = openMenuId === asset.id;
        return (
          <div key={asset.id} className="group relative flex flex-col">
            {/* Image Preview Card */}
            <div
              className={`
                relative w-full aspect-[4/3] rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 bg-cover bg-center
                ${isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-[#f2f2f2] group-hover:border-black/10 group-hover:shadow-lg group-hover:-translate-y-0.5'}
              `}
              style={{ backgroundImage: `url(${asset.url})` }}
              onClick={() => {
                if (!menuOpen) {
                  onTestSelect(asset?.url, asset.name)
                  // if (asset.url) window.open(asset.url, '_blank');
                }
              }}
            >
              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl" />

              {/* Selection Checkbox */}
              <div
                onClick={(e) => handleCheckboxClick(e, asset.id)}
                className={`absolute top-2 left-2 w-5 h-5 rounded-md border flex items-center justify-center z-20 transition-all
                  ${isSelected ? 'bg-blue-600 border-blue-600 opacity-100' : 'bg-white/90 border-gray-200 opacity-0 group-hover:opacity-100 hover:border-blue-400'}`}
              >
                {isSelected && <CheckOutlined className="text-white text-sm font-bold" />}
              </div>
            </div>

            {/* Caption */}
            <div className="mt-2.5 px-0.5 flex items-start justify-between gap-1">
              <div className="overflow-hidden flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate transition-colors ${isSelected ? 'text-blue-600' : 'text-[#111]'}`}>
                  {asset.name}
                </p>
                <p className="text-[#999] text-[11px] font-medium mt-0.5">
                  {formatBytes(asset.size)}
                </p>
              </div>

              {/* ··· Button + Dropdown */}
              {/* <div className="relative shrink-0 mt-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(menuOpen ? null : asset.id);
                  }}
                  className={`flex items-center justify-center w-6 h-6 rounded-md transition-all
                    ${menuOpen ? 'bg-black/8 text-black' : 'text-[#bbb] opacity-0 group-hover:opacity-100 hover:text-black hover:bg-black/5'}`}
                  title="Thêm tuỳ chọn"
                >
                  <EllipsisOutlined className="text-[18px] leading-none" />
                </button>

                {menuOpen && (
                  <DropdownMenu
                    asset={asset}
                    onDelete={() => onAssetAction(asset.id, 'delete')}
                    onClose={() => setOpenMenuId(null)}
                  />
                )}
              </div> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssetGrid;
