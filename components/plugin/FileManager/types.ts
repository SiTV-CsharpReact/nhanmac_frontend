
export interface Asset {
  id: string;
  name: string;
  type: 'folder' | 'image';
  parentId: string | null;
  itemsCount?: number;
  size?: number | string;
  dimensions?: string;
  url?: string;
}

export interface DirectoryNode {
  id: string; // Keep id for compatibility, but maybe path is better?
  // Sidebar uses path as key.
  // Actually sidebar uses `node.path`.
  // Let's add path.
  path: string;
  name: string;
  children: DirectoryNode[];
  isOpen?: boolean;
}
