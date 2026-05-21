import { useState, useEffect } from "react";
import { Pencil, MapPin, Phone, Mail, Star, Briefcase, Loader2 } from "lucide-react";
import EditProfileModal from "./EditProfileModal";
import { getLawyerDashboardSummary } from "../../services/lawyerService.jsx";

export default function LawyerProfile() {
  const [modalOpen, setModalOpen] = useState(false);
  const [profile,   setProfile]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const lawyerId =
        localStorage.getItem("legalease_lawyer_id") ||
        "e4d02eba-f313-421a-85b0-1ed07298ef9c";
      const data = await getLawyerDashboardSummary(lawyerId);
      setProfile(data.lawyer_profile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#3b5bdb]" />
        <p className="text-sm text-[#667085]">Loading profile details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-3xl">
        <h3 className="text-sm font-semibold text-red-800">Error Loading Profile</h3>
        <p className="text-xs text-red-600 mt-1">{error}</p>
        <button
          onClick={fetchProfile}
          className="mt-3 text-xs font-semibold text-[#3b5bdb] hover:underline bg-transparent border-none cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) return null;

  const initials = profile.name
    ? profile.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "??";

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#101828]">My Profile</h1>
        <p className="text-sm text-[#667085] mt-1">
          Manage your public profile and consultation settings
        </p>
      </div>

      <div className="bg-white border border-[#e4e7ec] rounded-[16px] overflow-hidden shadow-sm">

        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-[#3b5bdb] to-[#6e8efb]" />

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-full border-4 border-white bg-gradient-to-br from-[#3b5bdb] to-[#6e8efb] flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {initials}
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#000f26] hover:bg-[#00173d] transition-colors border-none cursor-pointer"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          </div>

          <h2 className="text-xl font-bold text-[#101828]">{profile.name || "N/A"}</h2>
          <p className="text-sm text-[#667085] mt-0.5">{profile.specialization || "Unspecified"}</p>

          {/* Stats row */}
          <div className="flex gap-6 mt-4 py-4 border-y border-[#e4e7ec]">
            <div className="text-center">
              <p className="text-xl font-bold text-[#101828]">{profile.totalCases ?? 0}</p>
              <p className="text-xs text-[#667085]">Total Cases</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-xl font-bold text-[#101828]">{profile.rating ?? "0.0"}</p>
                <Star size={14} className="fill-amber-400 text-amber-400" />
              </div>
              <p className="text-xs text-[#667085]">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-[#101828]">
                KSh {profile.consultation_fee ? profile.consultation_fee.toLocaleString() : "0"}
              </p>
              <p className="text-xs text-[#667085]">Per Session</p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <InfoItem icon={<Mail size={15} />}      label="Email"          value={profile.email}          />
            <InfoItem icon={<Phone size={15} />}     label="Phone"          value={profile.phone}          />
            <InfoItem icon={<MapPin size={15} />}    label="Location"       value={profile.location}       />
            <InfoItem icon={<Briefcase size={15} />} label="Specialization" value={profile.specialization} />
          </div>

          {/* Bio */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-[#344054] uppercase tracking-wide mb-2">Bio</p>
            <p className="text-sm text-[#667085] leading-relaxed">
              {profile.bio || "No professional bio provided yet."}
            </p>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchProfile(); // refresh profile after edit
        }}
        currentProfile={profile}
        onUpdate={handleProfileUpdate}
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
        <p className="text-sm font-medium text-[#101828]">{value || "Not set"}</p>
      </div>
    </div>
  );
}