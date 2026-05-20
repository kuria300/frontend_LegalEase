import React from 'react';

export const FilterBar = ({ onFilterChange, filters }) => {
  const categories = ["All Areas", "Family & Divorce Law", "Corporate & Commercial Law", "Criminal Defense"];

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="w-full bg-surface p-6 rounded-2xl border border-outline-variant mb-8">
      <h2 className="text-3xl font-semibold tracking-tight text-primary mb-2">
        Find the Right Legal Expertise
      </h2>
      <p className="text-sm text-on-surface-variant mb-6">
        Filter through certified advocates to find your perfect match.
      </p>
      
      <div className="flex flex-col gap-4">
        {/* Interactive Search Bar Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or keyword..."
            className="w-full p-3.5 pl-4 rounded-xl border border-outline-variant bg-surface-container-low text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        {/* Input Option Selection Layout Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <select 
            className="p-3 border border-outline-variant rounded-xl bg-surface text-sm text-primary font-medium focus:outline-none"
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select className="p-3 border border-outline-variant rounded-xl bg-surface text-sm text-primary font-medium focus:outline-none"><option>Nairobi</option></select>
          <select className="p-3 border border-outline-variant rounded-xl bg-surface text-sm text-primary font-medium focus:outline-none"><option>Any Experience</option></select>
          <select className="p-3 border border-outline-variant rounded-xl bg-surface text-sm text-primary font-medium focus:outline-none"><option>Any Price</option></select>
        </div>
      </div>
    </div>
  );
};