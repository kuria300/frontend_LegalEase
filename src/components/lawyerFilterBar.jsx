import React from "react";

const LawyerFilterBar = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-10">

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search lawyer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Category  */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="All">All Categories</option>
        <option value="Family Law">Family Law</option>
        <option value="Criminal Law">Criminal Law</option>
        <option value="Land Law">Land Law</option>
      </select>

    </div>
  );
};

export default LawyerFilterBar;