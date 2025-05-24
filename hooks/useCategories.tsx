import { useState, useEffect, useMemo } from 'react';
import { categoryApi } from '@/modules/admin/categoryApi';
import { Category } from '@/types/categoryItem';


export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetchData = async () => {
    try {
      const result = await categoryApi.getParent();
      setCategories(result.Data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
   
    fetchData();
  }, []);

  // useMemo để chuẩn hóa cho Select AntD
  const selectOptions = useMemo(() => {
    return [
      { label: 'Tất cả', value: '' }, 
      ...categories
      .filter(cat => cat.published)  // chỉ lấy chuyên mục đã publish (publish = true hoặc 1)
      .map(cat => ({
        label: cat.title,
        value: cat.id,
      })),
    ];
  }, [categories]);

  return { categories, selectOptions, loading, error };
};
