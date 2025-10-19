
import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const allCategories = ['الكل', ...categories];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {allCategories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
            selectedCategory === category
              ? 'bg-sky-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-sky-100'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
