import { useState, useEffect } from 'react';
import { categoryApi } from '@/modules/admin/categoryApi';
import { Categories } from '@/types/categoryItem';

export const useSectionWithCategories = () => {
  const [data, setData] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryApi.getAllSection()
      .then((res) => setData(res.Data))
      .finally(() => setLoading(false));
  }, []);

  // Rút gọn mảng section không trùng
  const sections = Array.from(
    new Map(data.map(item => [item.section_id, item.section_title]))
  ).map(([value, label]) => ({ value, label }));

  // Hàm lấy danh sách category theo section_id
  const getCategoriesBySection = (section_id: number) => {
    return data
      .filter(item => item.section_id === section_id)
      .map(item => ({
        label: item.category_title,
        value: item.category_id,
      }));
  };

  return {
    sections,                // [{ label: "Giới thiệu", value: 14 }, ...]
    getCategoriesBySection,  // (section_id) => [...]
    loading
  };
};
