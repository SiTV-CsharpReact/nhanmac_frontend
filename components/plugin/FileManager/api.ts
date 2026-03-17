import { env } from "../../../config/env";
const API_URL = `${env?.apiUrl}/folders`;

export interface BackendFile {
  name: string;
  path: string;
  size?: number;
  url?: string;
}

export interface BackendFolder {
  name: string;
  path: string;
}

export interface ListResponse {
  folders: BackendFolder[];
  files: BackendFile[];
  currentFolder: string;
}

export interface TreeItem {
  name: string;
  path: string;
  children: TreeItem[];
}

export const api = {
  async list(folder: string = ''): Promise<ListResponse> {
    const res = await fetch(`${API_URL}/list?folder=${encodeURIComponent(folder)}`);
    if (!res.ok) throw new Error('Failed to fetch list');
    return res.json();
  },

  async upload(files: File[], folder: string = '') {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    console.log(encodeURIComponent(folder));
    // Note: The backend uses query param 'folder' for destination in multer storage config
    // or we might need to adjust if backend expects it in body.
    // Based on backend code: const folder = safePath(req.query.folder || '');
    const res = await fetch(`${API_URL}/upload?folder=${encodeURIComponent(folder)}`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },

  async createFolder(name: string, parent: string = '') {
    const res = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parent }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Create folder failed');
    }
    return res.json();
  },

  async rename(oldPath: string, newName: string) {
    const res = await fetch(`${API_URL}/rename`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPath, newName }),
    });
    if (!res.ok) throw new Error('Rename failed');
    return res.json();
  },

  async move(source: string, target: string) {
    const res = await fetch(`${API_URL}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, target }),
    });
    if (!res.ok) throw new Error('Move failed');
    return res.json();
  },

  async delete(items: { path: string }[]) {
    const res = await fetch(`${API_URL}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error('Delete failed');
    return res.json();
  },

  async getTree(): Promise<TreeItem[]> {
    const res = await fetch(`${API_URL}/tree`);
    if (!res.ok) throw new Error('Failed to fetch tree');
    return res.json();
  },

  async search(keyword: string, folder: string = '') {
    const res = await fetch(`${API_URL}/search?keyword=${encodeURIComponent(keyword)}&folder=${encodeURIComponent(folder)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  async getFolderSize(folder: string = '') {
    const res = await fetch(`${API_URL}/size?folder=${encodeURIComponent(folder)}`);
    if (!res.ok) throw new Error('Failed to fetch folder size');
    return res.json();
  },

  async getStorageInfo() {
    const res = await fetch(`${API_URL}/storage`);
    if (!res.ok) throw new Error('Failed to fetch storage info');
    return res.json();
  },
};
