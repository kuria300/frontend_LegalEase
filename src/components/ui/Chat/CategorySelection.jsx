import React from "react";
import { Briefcase, Landmark, FileText, Scale, CircleHelp } from "lucide-react";


const CategorySelection = ({ onSelectCategory }) => {
    // Array of legal categories available for selection
  // Each category has:
  // - key: Unique identifier used to track which category was selected
  // - title: Human-readable name shown to the user
  // - icon: Lucide React icon component for visual representation

  const categories = [
    { key: "employment", title: "Employment Issues", icon: Briefcase },
    { key: "property", title: "Property & Land", icon: Landmark },
    { key: "family", title: "Family Law", icon: FileText },
    { key: "business", title: "Business & Contracts", icon: Scale },
    { key: "criminal", title: "Criminal Matters", icon: CircleHelp },
    { key: "other", title: "Other Legal Issues", icon: CircleHelp },
  ];

  return (
    <div className="flex flex-col gap-2">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.key}
            onClick={() => onSelectCategory(category.key)}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition border border-gray-100"
          >
            <Icon size={18} className="text-gray-500" />
            <span>{category.title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategorySelection;

