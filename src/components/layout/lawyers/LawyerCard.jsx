import React from "react";
import { Verified } from "lucide-react";
import { MapPin, BriefcaseBusiness } from "lucide-react";

export const LawyerCard = ({lawyer, onViewProfile}) => {
  const firstName =
    lawyer.lawyer_applications?.users?.first_name || "";

  const secondName =
    lawyer.lawyer_applications?.users?.second_name || "";


  return (
    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="p-6">

        {/* IMAGE / AVATAR */}
        <div className="relative flex justify-center bg-gray-100 rounded-2xl p-8 mb-5">

          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
            {firstName[0]}
            {secondName[0]}
          </div>

          {lawyer.is_active && (
            <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
              <Verified className="w-4 h-4" />
              Verified
            </span>
          )}
        </div>

        {/* LAWYER INFO */}
        <h2 className="text-xl font-bold text-gray-900">
          Adv. {firstName} {secondName}
        </h2>

        <p className="text-gray-500 mt-1">
          {lawyer.category}
        </p>

        {/* BADGES */}
        <div className="flex flex-wrap gap-2 mt-5 mb-6">

          <span className="bg-gray-100 px-3 py-2 rounded-xl text-sm">
            <BriefcaseBusiness className="w-4 h-4 inline mr-1" />
            {lawyer.experience} Years Experience
          </span>

          <span className="bg-gray-100 px-3 py-2 rounded-xl text-sm">
            <MapPin className="w-4 h-4 inline mr-1" />
            Kenya
          </span>

        </div>

        {/* BUTTON */}
        <button
          onClick={()=>onViewProfile(lawyer)}
          className="w-full bg-gray-900 cursor-pointer hover:bg-[#735c00] text-white py-3 rounded-2xl font-semibold transition-all"
        >
          View Profile
        </button>

      </div>
    </div>
  );
};