
import React from 'react';
import { SearchIcon, PlusIcon, UploadIcon, CloseIcon, TrashIcon } from './Icons';

interface TopBarProps {
  selectedCount: number;
  onDelete: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ selectedCount, onDelete }) => {
  return (
    <header className="h-20 border-b border-gray-100 px-6 flex items-center justify-between bg-white z-10 shrink-0">
      <div className="flex items-center space-x-12 flex-1">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 min-w-max">Image Manager</h1>
        
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search assets..."
            className="block w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 ml-6">
        {selectedCount > 0 && (
          <button 
            onClick={onDelete}
            className="flex items-center px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all shadow-sm border border-red-100 animate-in fade-in slide-in-from-right-2 duration-200"
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete ({selectedCount})
          </button>
        )}
        <button className="flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Folder
        </button>
        <button className="flex items-center px-4 py-2.5 bg-neutral-900 rounded-xl text-sm font-semibold text-white hover:bg-neutral-800 transition-all shadow-sm">
          <UploadIcon className="w-4 h-4 mr-2" />
          Upload Images
        </button>
        <div className="h-10 w-[1px] bg-gray-100 mx-2"></div>
        <button className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 hover:text-gray-700 transition-colors">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
