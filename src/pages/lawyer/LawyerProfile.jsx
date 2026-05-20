import { useState } from "react";
import { Pencil, MapPin, Phone, Mail, Star, Briefcase } from "lucide-react";
import EditProfileModal from "./EditProfileModal";

const MOCK_PROFILE = {
  name:           "Advocate Maina",
  email:          "maina@legalease.co.ke",
  phone:          "+254 712 345 678",
  specialization: "Family Law",
  location:       "Nairobi, Kenya",
  fee:            5000,
  rating:         4.8,
  totalCases:     87,
  bio:            "Experienced legal practitioner with over 10 years of expertise in family law, property disputes, and contract review. Committed to providing accessible and professional legal guidance.",
};

export default function LawyerProfile() {
  const [modalOpen, setModalOpen] = useState(false);
  const [profile]                 = useState(MOCK_PROFILE);

  return (
    <div className="max-w-3xl">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#101828]">My Profile</h1>
        <p className="text-sm text-[#667085] mt-1">Manage your public profile and consultation settings</p>
      </div>

      {/* Profile card */}
      <div className="bg-white border border-[#e4e7ec] rounded-[16px] overflow-hidden shadow-sm">

        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-[#3b5bdb] to-[#6e8efb]" />

        {/* Avatar + edit button */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-full border-4 border-white bg-gradient-to-br from-[#3b5bdb] to-[#6e8efb] flex items-center justify-center text-white text-2xl font-bold shadow-md">
              AM
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#3b5bdb] hover:bg-[#2f4ac0] transition-colors border-none cursor-pointer"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          </div>

          {/* Name + specialization */}
          <h2 className="text-xl font-bold text-[#101828]">{profile.name}</h2>
          <p className="text-sm text-[#667085] mt-0.5">{profile.specialization}</p>

          {/* Stats row */}
          <div className="flex gap-6 mt-4 py-4 border-y border-[#e4e7ec]">
            <div className="text-center">
              <p className="text-xl font-bold text-[#101828]">{profile.totalCases}</p>
              <p className="text-xs text-[#667085]">Total Cases</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-[#101828]">{profile.rating}</p>
              <p className="text-xs text-[#667085]">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-[#101828]">KSh {profile.fee.toLocaleString()}</p>
              <p className="text-xs text-[#667085]">Per Session</p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <InfoItem icon={<Mail size={15} />}      label="Email"          value={profile.email}    />
            <InfoItem icon={<Phone size={15} />}     label="Phone"          value={profile.phone}    />
            <InfoItem icon={<MapPin size={15} />}    label="Location"       value={profile.location} />
            <InfoItem icon={<Briefcase size={15} />} label="Specialization" value={profile.specialization} />
          </div>

          {/* Bio */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-[#344054] uppercase tracking-wide mb-2">Bio</p>
            <p className="text-sm text-[#667085] leading-relaxed">{profile.bio}</p>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#f8f9fc] rounded-lg border border-[#e4e7ec]">
      <div className="text-[#3b5bdb] shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] font-semibold text-[#667085] uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-[#101828]">{value}</p>
      </div>
    </div>
  );
}