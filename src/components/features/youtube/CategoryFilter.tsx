import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchVideoCategories } from '../../../services/youtubeApi';

interface CategoryFilterProps {
  onSelectCategory: (categoryId: string) => void;
  selectedCategory: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchVideoCategories();
        // Filter out categories that aren't useful
        const filteredCategories = categoryData.filter(
          cat => !['19', '22', '25', '29'].includes(cat.id)
        );
        setCategories([{ id: '', title: 'All Categories' }, ...filteredCategories]);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="h-10 w-32 rounded-full bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 overflow-x-auto pb-2">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex gap-2"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full transition-all ${
              selectedCategory === category.id
                ? 'bg-secondary text-black font-medium shadow-glow'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {category.title}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryFilter;