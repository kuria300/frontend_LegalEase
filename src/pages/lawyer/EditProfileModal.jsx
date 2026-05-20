import { useState } from "react";
import { X, DollarSign, FileText, User, Mail, Phone, Save } from "lucide-react";

export default function EditProfileModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name:        "Advocate Maina",
    email:       "maina@legalease.co.ke",
    phone:       "+254 712 345 678",
    bio:         "Experienced legal practitioner with over 10 years of expertise in family law, property disputes, and contract review. Committed to providing accessible and professional legal guidance.",
    fee:         "5000",
    specialization: "Family Law",
  });

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: wire to real API in LAP-78
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[16px] w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e7ec]">
          <div>
            <h2 className="text-base font-bold text-[#101828]">Edit Profile</h2>
            <p className="text-xs text-[#667085] mt-0.5">Update your bio, fees and contact info</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-[#667085] hover:bg-[#f0f2f5] transition-colors border-none bg-transparent cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#344054] uppercase tracking-wide">
              Full Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 border border-[#e4e7ec] rounded-lg text-sm text-[#101828] outline-none focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/10 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#344054] uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 border border-[#e4e7ec] rounded-lg text-sm text-[#101828] outline-none focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/10 transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#344054] uppercase tracking-wide">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 border border-[#e4e7ec] rounded-lg text-sm text-[#101828] outline-none focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/10 transition-all"
              />
            </div>
          </div>

          {/* Specialization */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#344054] uppercase tracking-wide">
              Specialization
            </label>
            <select
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-[#e4e7ec] rounded-lg text-sm text-[#101828] outline-none focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/10 transition-all bg-white cursor-pointer"
            >
              <option>Family Law</option>
              <option>Property Law</option>
              <option>Criminal Defense</option>
              <option>Contract Law</option>
              <option>Employment Law</option>
              <option>Immigration Law</option>
              <option>Corporate Law</option>
            </select>
          </div>

          {/* Consultation Fee */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#344054] uppercase tracking-wide">
              Consultation Fee (KSh)
            </label>
            <div className="relative">
              <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
              <input
                name="fee"
                type="number"
                value={form.fee}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 border border-[#e4e7ec] rounded-lg text-sm text-[#101828] outline-none focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/10 transition-all"
              />
            </div>
            <p className="text-[11px] text-[#667085]">This is what clients will be charged per session</p>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#344054] uppercase tracking-wide">
              Bio
            </label>
            <div className="relative">
              <FileText size={15} className="absolute left-3 top-3 text-[#667085]" />
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className="w-full pl-9 pr-4 py-2.5 border border-[#e4e7ec] rounded-lg text-sm text-[#101828] outline-none focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/10 transition-all resize-none"
              />
            </div>
            <p className="text-[11px] text-[#667085]">{form.bio.length}/500 characters</p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e4e7ec] bg-[#f8f9fc]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#344054] bg-white border border-[#e4e7ec] hover:bg-[#f0f2f5] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-[#3b5bdb] hover:bg-[#2f4ac0] disabled:opacity-60 transition-colors cursor-pointer border-none"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <span>✓</span>
                Saved!
              </>
            ) : (
              <>
                <Save size={15} />
                Save Changes
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}