import React from "react";

const LawyerCard = ({ lawyer, onView }) => {
  // Extract and combine split names from database schema
  const firstName = lawyer?.lawyer_applications?.users?.first_name || "Verified";
  const secondName = lawyer?.lawyer_applications?.users?.second_name || "Lawyer";
  const fullName = `${firstName} ${secondName}`;
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition duration-300">

      {/* Avatar placeholder */}
      <div className="w-14 h-14 rounded-full bg-gray-200 mb-4"></div>

      {/* Name (Updated to use the combined schema names) */}
      <h2 className="text-lg font-semibold text-gray-900">
        {fullName}
      </h2>

      {/* Category */}
      <p className="text-sm text-on-surface-variant mt-1">
        {lawyer?.category || "General Practice"}
      </p>

      {/* Experience + Fee row (Updated keys to match your Prisma schema) */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <span className="text-on-surface-variant">
          {lawyer?.experience ?? 0} Yrs Experience
        </span>

        <span className="text-primary font-semibold">
          KES {lawyer?.consultation_fee ?? 0}/hr
        </span>
      </div>

     
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