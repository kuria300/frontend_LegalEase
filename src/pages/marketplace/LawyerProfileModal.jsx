import React from "react";

const LawyerProfileModal = ({ lawyer, onClose }) => {
  if (!lawyer) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

      {/* Modal Box */}
      <div className="bg-white w-full max-w-lg rounded-3xl p-8 relative shadow-xl animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gray-200 mb-6"></div>

        {/* Name */}
        <h2 className="text-3xl font-bold text-primary">
          {lawyer.name}
        </h2>

        {/* Category */}
        <p className="text-on-surface-variant mt-2 text-lg">
          {lawyer.category}
        </p>

        {/* Details */}
        <div className="mt-6 space-y-4">

          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Experience</span>
            <span className="text-gray-900">{lawyer.experience}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Consultation Fee</span>
            <span className="text-primary font-semibold">
              KES {lawyer.fee}
            </span>
          </div>

        </div>

        {/* CTA */}
        <button className="mt-8 w-full bg-primary text-white py-3 rounded-2xl hover:opacity-90 transition">
          Book Consultation
        </button>

      </div>
    </div>
  );
};

export default LawyerProfileModal;