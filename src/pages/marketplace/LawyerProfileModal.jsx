import React from "react";
import { X, Verified } from "lucide-react";

const LawyerProfileModal = ({ lawyer, onClose }) => {
  if (!lawyer) return null;

  // Safe extraction matching your Prisma DB relations precisely
  const firstName = lawyer.lawyer_applications?.users?.first_name || '';
  const secondName = lawyer.lawyer_applications?.users?.second_name || '';
  const category = lawyer.category || 'Legal Practitioner';
  const experience = lawyer.experience || 0;
  const consultationFee = lawyer.consultation_fee || '0.00';
  const description = lawyer.description || 'No description provided.';
  const isVerified = lawyer.is_active;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-all duration-200">

      {/* Modal Box - Styled with theme container and outlines */}
      <div className="bg-surface w-full max-w-lg rounded-3xl p-8 relative border border-outline-variant shadow-2xl animate-fadeIn">

        {/* Close Button using Lucide asset matching navbar styling */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header Block */}
        <div className="flex flex-col items-start mt-2">
          {/* Avatar Placeholder */}
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 mb-5">
            <span className="text-primary text-2xl font-bold">
              {firstName[0]}{secondName[0]}
            </span>
          </div>

          {/* Name & Active Badge integration */}
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-3xl font-bold text-primary tracking-tight">
              Adv. {firstName} {secondName}
            </h2>
            {isVerified && (
              <span className="bg-secondary/10 text-secondary text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-secondary/20">
                <Verified className="w-3.5 h-3.5 fill-secondary text-white" />
                Verified
              </span>
            )}
          </div>

          <p className="text-on-surface-variant font-medium text-lg mt-1">
            {category}
          </p>
        </div>

        {/* Detailed Description / About Section from Image 1 */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold tracking-wide text-primary uppercase opacity-60">About</h4>
          <p className="text-on-surface-variant text-sm mt-1.5 leading-relaxed bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
            {description}
          </p>
        </div>

        {/* Specific Details Metadata Lists */}
        <div className="mt-6 pt-4 border-t border-outline-variant/50 space-y-3.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant font-medium">Experience Level</span>
            <span className="text-primary font-bold bg-surface-container-low border border-outline-variant px-3 py-1 rounded-xl">
              {experience} Years Active
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant font-medium">Standard Consultation Fee</span>
            <span className="text-primary font-extrabold text-base">
              KES {Number(consultationFee).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Main CTA Action Button using home accent color configurations */}
        <button className="mt-8 w-full bg-primary text-white text-sm font-bold py-3.5 rounded-xl hover:bg-black shadow-md active:scale-[0.99] transition-all">
          Book Consultation
        </button>

      </div>
    </div>
  );
};

export default LawyerProfileModal;