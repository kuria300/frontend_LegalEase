import React from "react";

const LawyerCard = ({ lawyer, onView }) => {
  if (!lawyer) return null; // safety check (prevents blank crashes)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition duration-300">

      {/* Avatar placeholder */}
      <div className="w-14 h-14 rounded-full bg-gray-200 mb-4"></div>

      {/* Name */}
      <h2 className="text-lg font-semibold text-gray-900">
        {lawyer.name}
      </h2>

      {/* Category */}
      <p className="text-sm text-on-surface-variant mt-1">
        {lawyer.category}
      </p>

      {/* Experience + Fee row */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <span className="text-on-surface-variant">
          {lawyer.experience}
        </span>

        <span className="text-primary font-semibold">
          KES {lawyer.fee}
        </span>
      </div>

      {/* Button */}
      <button
        onClick={onView}
        className="mt-5 w-full bg-primary text-white py-2.5 rounded-xl hover:opacity-90 transition"
      >
        View Profile
      </button>
    </div>
  );
};

export default LawyerCard;