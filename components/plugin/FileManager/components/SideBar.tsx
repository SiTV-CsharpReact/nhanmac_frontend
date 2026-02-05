
import React from 'react';
import { FolderNode } from '../types';
import { MOCK_FOLDERS } from '../constants';
import { ChevronDownIcon, ChevronRightIcon, FolderIcon } from './Icons';

const FolderTreeItem: React.FC<{ node: FolderNode; depth: number }> = ({ node, depth }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isActive = node.isActive;
  const paddingLeft = depth * 16 + 20;

  return (
    <div>
      <div 
        className={`group flex items-center py-2 px-3 mr-4 rounded-xl cursor-pointer transition-all ${
          isActive 
            ? 'bg-blue-50 text-blue-600 font-semibold' 
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
        }`}
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        <div className="w-4 flex items-center justify-center mr-1">
          {hasChildren ? (
            node.isOpen ? <ChevronDownIcon className="w-3.5 h-3.5" /> : <ChevronRightIcon className="w-3.5 h-3.5" />
          ) : null}
        </div>
        <FolderIcon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} filled={isActive} />
        <span className="text-sm">{node.name}</span>
      </div>
      {node.isOpen && node.children && (
        <div className="mt-1">
          {node.children.map(child => (
            <FolderTreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 bg-white flex flex-col h-full shrink-0">
      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-6 mb-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Directories</h3>
        </div>
        <nav className="space-y-1">
          {MOCK_FOLDERS.map(folder => (
            <FolderTreeItem key={folder.id} node={folder} depth={0} />
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-gray-100">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs font-semibold text-gray-900">Storage</span>
            <span className="text-[10px] font-bold text-blue-600">72%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '72%' }}></div>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">3.6 GB of 5 GB used</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
