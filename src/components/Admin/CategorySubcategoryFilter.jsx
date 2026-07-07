import { useState, useEffect } from "react";
import api from "../../services/apiAdmin";

export default function CategorySubcategoryFilter({
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
}) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredSubcategories([]);
      return;
    }

    const filtered = subcategories.filter(
      (sub) => sub.category === selectedCategory.id,
    );
    setFilteredSubcategories(filtered);
    // Reset subcategory selection if it doesn't match the new category
    if (
      selectedSubcategory &&
      selectedSubcategory.category !== selectedCategory.id
    ) {
      onSubcategoryChange(null);
    }
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, subcategoriesData] = await Promise.all([
        api.category.list(),
        api.subcategory.list(),
      ]);
      setCategories(categoriesData.data);
      setSubcategories(subcategoriesData.data);
    } catch (error) {
      console.error("Error loading categories/subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    const category = categories.find((c) => c.id === parseInt(categoryId));
    onCategoryChange(category || null);
    if (!category) onSubcategoryChange(null);
  };

  const handleSubcategorySelect = (subcategoryId) => {
    const subcategory = subcategories.find(
      (s) => s.id === parseInt(subcategoryId),
    );
    onSubcategoryChange(subcategory || null);
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading filters...</div>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">
        Select Category and Subcategory for new questions:
      </p>

      <div className="grid grid-cols-1 gap-4">
        {/* Category Select */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Category *
          </label>
          <select
            value={selectedCategory?.id || ""}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">-- Select Category --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Select */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Subcategory *
          </label>
          <select
            value={selectedSubcategory?.id || ""}
            onChange={(e) => handleSubcategorySelect(e.target.value)}
            disabled={!selectedCategory}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">-- Select Subcategory --</option>
            {filteredSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCategory && selectedSubcategory && (
        <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
          ✓ New questions will be created under:{" "}
          <strong>{selectedCategory.name}</strong> →{" "}
          <strong>{selectedSubcategory.name}</strong>
        </div>
      )}
    </div>
  );
}
