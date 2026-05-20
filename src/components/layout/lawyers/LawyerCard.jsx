import React from 'react';
import { Verified } from "lucide-react";

export const LawyerCard = ({ lawyer, onViewProfile }) => {
  // Safe extraction matching your exact Prisma schema relations
  const firstName = lawyer.lawyer_applications?.users?.first_name || '';
  const secondName = lawyer.lawyer_applications?.users?.second_name || '';
  const category = lawyer.category || 'Legal Practitioner';
  const experience = lawyer.experience || 0;
  const isVerified = lawyer.is_active;

  return (
    <div className="border border-outline-variant rounded-2xl p-6 bg-surface flex flex-col justify-between min-h-100 w-full max-w-85 shadow-sm">
      <div>
        {/* Top Header & Avatar Wrapper - Uses surface container matching home chatbot style */}
        <div className="relative flex justify-center mb-5 bg-surface-container-low rounded-xl p-6 h-36 items-center border border-outline-variant/30">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
            <span className="text-primary text-xl font-bold">
              {firstName[0]}{secondName[0]}
            </span>
          </div>
          
          {/* Gold Verified Star Badge using your home page icon */}
          {isVerified && (
            <span className="absolute top-3 right-3 bg-secondary/10 text-secondary text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Verified className="w-3.5 h-3.5 fill-secondary text-white" />
              Verified
            </span>
          )}
        </div>

        {/* Lawyer Names & Specialty */}
        <h3 className="text-xl font-bold text-primary tracking-tight">
          Adv. {firstName} {secondName}
        </h3>
        <p className="text-sm text-on-surface-variant font-medium mt-1 mb-4">
          {category}
        </p>

        {/* Dynamic Detail Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="bg-surface-container-low border border-outline-variant text-primary text-xs px-2.5 py-1.5 rounded-xl font-medium">
            💼 {experience} Years Exp.
          </span>
          <span className="bg-surface-container-low border border-outline-variant text-primary text-xs px-2.5 py-1.5 rounded-xl font-medium">
            📍 Nairobi, Kenya
          </span>
        </div>
      </div>

      {/* Dark Action Button matching the system typography styles */}
      <button 
        onClick={() => onViewProfile(lawyer.id)}
        className="w-full bg-[#2A3439] hover:bg-primary text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-sm"
      >
        View Profile
      </button>
    </div>
  );
};