import React from "react";

export const FilterBar = ({ onFilterChange, filters }) => {

  const categories = [
    "All Areas",
    "Family & Divorce Law",
    "Corporate & Commercial Law",
    "Criminal Defense",
  ];

  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-10 shadow-sm">

      <h1 className="text-4xl font-bold text-gray-900 mb-3">
        Find Trusted Lawyers
      </h1>

      <p className="text-gray-500 mb-8">
        Browse verified advocates across Kenya.
      </p>

      <div className="space-y-4">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search lawyers..."
          value={filters.search}
          onChange={(e) =>
            handleChange("search", e.target.value)
          }
          className="w-full border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <select
            value={filters.category}
            onChange={(e) =>
              handleChange("category", e.target.value)
            }
            className="border border-gray-300 rounded-2xl p-4 focus:outline-none"
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          <select className="border border-gray-300 rounded-2xl p-4">
            <option>Nairobi</option>
          </select>

          <select className="border border-gray-300 rounded-2xl p-4">
            <option>Any Experience</option>
          </select>

          <select className="border border-gray-300 rounded-2xl p-4">
            <option>Any Price</option>
          </select>

        </div>
      </div>
    </div>
  );
};