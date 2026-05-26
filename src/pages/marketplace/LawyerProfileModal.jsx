import React from "react";
import { useState } from "react";
import { X, ArrowLeft, Verified } from "lucide-react";
import BookingCard from "../../components/ui/booking/BookingCard";

const LawyerProfileModal = ({ lawyer, onClose }) => {
  if (!lawyer) {
    return null;
  }
  const [showBooking, setShowBooking] = useState(false);

  // extraction matching your DB relation
  const firstName = lawyer.lawyer_applications?.users?.first_name || "";
  const secondName = lawyer.lawyer_applications?.users?.second_name || "";
  const category = lawyer.category || "Legal Practitioner";
  const experience = lawyer.experience || 0;
  const consultationFee = lawyer.consultation_fee || "0.00";
  const description = lawyer.description || "No description provided.";
  const isVerified = lawyer.is_active;

  console.log(lawyer)

  const bookingLawyer = {
    id: lawyer.lawyer_applications.user_id,
    first_name: firstName,
    last_name: secondName,
    consultation_fee: Number(consultationFee),
    specialty: category,
    photo_url: lawyer.photo_url || null,
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 transition-all duration-200">
      <div className="bg-surface w-full max-w-2xl rounded-3xl relative border border-outline-variant shadow-2xl animate-fadeIn overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 z-10 p-1.5 rounded-full transition-colors
            border border-transparent hover:border-outline-variant
            ${
              showBooking
                ? "text-white hover:bg-white/10"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lawyer Profile */}
        {!showBooking && (
          <div className="p-8">
            {/* Profile header */}
            <div className="flex flex-col items-start mt-2">
              {/* Avatar with initials */}
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 mb-5">
                <span className="text-primary text-2xl font-bold">
                  {firstName[0]}
                  {secondName[0]}
                </span>
              </div>

              {/* Name and verified badge */}
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

            {/* About section */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold tracking-wide text-primary uppercase opacity-60">
                About
              </h4>
              <p className="text-on-surface-variant text-sm mt-1.5 leading-relaxed bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 wrap-break-word">
                {description}
              </p>
            </div>

            {/* Details */}
            <div className="mt-6 pt-4 border-t border-outline-variant/50 space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant font-medium">
                  Experience Level
                </span>
                <span className="text-primary font-bold bg-surface-container-low border border-outline-variant px-3 py-1 rounded-xl">
                  {experience} Years Active
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant font-medium">
                  Standard Consultation Fee
                </span>
                <span className="text-primary font-extrabold text-base">
                  KES {Number(consultationFee).toLocaleString()}
                </span>
              </div>
            </div>

            {/*switches to booking card view */}
            <button
              onClick={() => setShowBooking(true)}
              className="mt-8 w-full bg-primary cursor-pointer hover:bg-[#735c00] text-white text-sm font-bold py-3.5 rounded-xl shadow-md active:scale-[0.99] transition-all"
            >
              Book Consultation
            </button>
          </div>
        )}

        {/* Booking Card*/}
        {showBooking && (
          <div>
            {/* Back button*/}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant bg-surface-container-low rounded-t-3xl sticky top-0 z-10">
            <button
              onClick={() => setShowBooking(false)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-primary hover:bg-secondary border border-outline-variant transition-all shrink-0"
              aria-label="Back to profile"
            >
              <ArrowLeft size={16} className="text-white" strokeWidth={2.5} />
            </button>

            <div>
              <p className="text-[10px] text-outline uppercase tracking-widest">Back to</p>
              <p className="text-sm font-semibold text-on-surface leading-none mt-0.5">
                Adv. {firstName} {secondName}
              </p>
            </div>
          </div>
            {/* <div className="px-6 pt-6">
              <button
                onClick={() => setShowBooking(false)}
                className="text-sm text-on-surface-variant hover:text-primary transition flex items-center gap-1"
              >
                ← Back to profile
              </button>
            </div> */}

            <BookingCard lawyer={bookingLawyer} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerProfileModal;