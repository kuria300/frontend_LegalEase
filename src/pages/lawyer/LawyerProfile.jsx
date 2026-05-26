import { useState, useEffect } from "react";
import {
  Pencil,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  ShieldCheck,
  X,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import LawyerSidebar from "../../components/layout/lawyers/LawyerSidebar.jsx";
import { useAuth } from "../../hooks/useAuth";

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

//Skeleton

function ProfileSkeleton() {
  return (
    <div className="bg-surface border border-outline-variant rounded-3xl shadow-sm overflow-hidden animate-pulse">
      {/* Banner */}
      <div className="h-32 bg-gray-200" />

      <div className="px-6 md:px-10 pb-8">
        {/* Avatar + name */}
        <div className="-mt-12 flex flex-col gap-5">
          <div className="w-28 h-28 rounded-full bg-gray-300 border-4 border-white" />
          <div className="flex flex-col gap-2">
            <div className="h-7 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-100 rounded w-32" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
          <div className="h-28 bg-gray-200 rounded-2xl" />
          <div className="h-28 bg-gray-200 rounded-2xl" />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
          ))}
        </div>

        {/* Bio */}
        <div className="mt-8 h-28 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );
}

//Info Card

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="font-semibold text-on-surface">{label}</h3>
      </div>
      <p className="text-on-surface-variant text-sm">{value || "Not set"}</p>
    </div>
  );
}

// Edit Profile Modal

function EditProfileModal({ isOpen, onClose, currentProfile, profileId, onUpdate }) {
  const [form, setForm] = useState({
    category:         "",
    phone_number:     "",
    description:      "",
    experience:       "",
    consultation_fee: "",
  });
  const [saving, setSaving] = useState(false);

  // Sync form when modal opens
  useEffect(() => {
    if (currentProfile) {
      setForm({
        category:         currentProfile.category         || "",
        phone_number:     currentProfile.phone_number     || "",
        description:      currentProfile.description      || "",
        experience:       currentProfile.experience       ?? "",
        consultation_fee: currentProfile.consultation_fee ?? "",
      });
    }
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.category || !form.phone_number) {
      toast.error("Category and phone number are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.patch(
        `/api/lawyerProfile/${profileId}`,
        {
          category:         form.category,
          phone_number:     form.phone_number,
          description:      form.description,
          experience:       Number(form.experience),
          consultation_fee: Number(form.consultation_fee),
        },
        { headers: authHeader() }
      );

      onUpdate(res.data.data);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: "category",         label: "Specialization / Category", type: "text",   placeholder: "e.g. Employment & Labor Law" },
    { name: "phone_number",     label: "Phone Number",              type: "tel",    placeholder: "+254 700 000 000" },
    { name: "experience",       label: "Years of Experience",       type: "number", placeholder: "e.g. 8" },
    { name: "consultation_fee", label: "Consultation Fee (KSh)",    type: "number", placeholder: "e.g. 3500" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold text-on-surface mb-1">Edit Profile</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Update your public profile information.
        </p>

        <div className="flex flex-col gap-4">
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-on-surface mb-1.5">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>
          ))}

          {/* Bio / Description — textarea */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">
              Professional Bio
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Brief description of your expertise..."
              className="w-full border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface-variant/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

//Main Component

export default function LawyerProfile() {
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile]     = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Wait for auth to resolve before fetching
    if (authLoading) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);

        if (!user?.id) throw new Error("User not authenticated");

        const res = await axios.get(`/api/lawyers/fetch/profile`, {
          headers: authHeader(),
        });

        const data = res.data.data || res.data;
        setProfileId(data.id);

        setProfile({
          id:               data.id,
          // Name & email always from useAuth.already fresh from session
          first_name:       user.first_name        || "",
          second_name:      user.second_name       || "",
          email:            user.email             || "",
          category:         data.category          || "",
          experience:       data.experience        ?? 0,
          consultation_fee: data.consultation_fee  ?? 0,
          description:      data.description       || "",
          phone_number:     data.phone_number      || "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authLoading, user]);

  const handleProfileUpdate = (updatedData) => {
    setProfile((prev) => ({ ...prev, ...updatedData }));
  };

  const initials = profile
    ? `${profile.first_name?.[0] || ""}${profile.second_name?.[0] || ""}`.toUpperCase() || "LA"
    : "LA";

  const fullName = profile
    ? `${profile.first_name} ${profile.second_name}`.trim() || "Lawyer"
    : "";

  return (
    <div className="min-h-screen bg-surface-container/50 flex flex-col md:flex-row">
      <LawyerSidebar />

      <main className="md:ml-64 w-full md:flex-1 min-h-screen">
        <section className="w-full max-w-7xl mx-auto flex flex-col gap-8 py-8 px-6">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Lawyer Profile</h1>
            <p className="text-base md:text-lg text-on-surface-variant mt-2">
              Manage your public information and consultation settings.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Skeleton while*/}
          {(authLoading || loading) && <ProfileSkeleton />}

          {/* Real content */}
          {!authLoading && !loading && !error && profile && (
            <div className="bg-surface border border-outline-variant rounded-3xl shadow-sm overflow-hidden">

              {/* Banner */}
              <div className="h-32 bg-primary/10 relative">
                <button
                  onClick={() => setModalOpen(true)}
                  className="absolute top-4 right-4 flex items-center gap-2 bg-surface hover:bg-surface-container text-on-surface text-sm font-medium px-4 py-2 rounded-xl border border-outline-variant transition-all"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              </div>

              <div className="px-6 md:px-10 pb-8">

                {/* Avatar + Name */}
                <div className="-mt-12 flex flex-col md:items-start gap-5">
                  <div className="w-28 h-28 rounded-full bg-primary border-4 border-surface flex items-center justify-center shadow-md">
                    <span className="text-white text-3xl font-bold">{initials}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
                        {fullName}
                      </h2>
                      <span className="flex items-center gap-1 bg-secondary/10 text-secondary border border-secondary/20 text-xs font-semibold px-3 py-1 rounded-full">
                        <ShieldCheck className="w-4 h-4 fill-secondary text-white" />
                        Verified Lawyer
                      </span>
                    </div>
                    <p className="text-on-surface-variant mt-1">{profile.category}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
                  <div className="bg-secondary text-white rounded-2xl p-6 shadow-md">
                    <p className="text-sm opacity-80">Years of Experience</p>
                    <h3 className="text-4xl font-bold mt-2">{profile.experience}</h3>
                  </div>

                  <div className="bg-primary text-white rounded-2xl p-6 shadow-md">
                    <p className="text-sm opacity-80">Consultation Fee</p>
                    <h3 className="text-3xl font-bold mt-2">
                      KSh {Number(profile.consultation_fee).toLocaleString("en-KE")}
                    </h3>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                  <InfoCard
                    icon={<Mail className="w-5 h-5 text-primary" />}
                    label="Email Address"
                    value={profile.email}
                  />
                  <InfoCard
                    icon={<Phone className="w-5 h-5 text-primary" />}
                    label="Phone Number"
                    value={profile.phone_number}
                  />
                  <InfoCard
                    icon={<Briefcase className="w-5 h-5 text-primary" />}
                    label="Specialization"
                    value={profile.category}
                  />
                  <InfoCard
                    icon={<MapPin className="w-5 h-5 text-primary" />}
                    label="Experience"
                    value={profile.experience ? `${profile.experience} years` : null}
                  />
                </div>

                {/* Bio */}
                <div className="mt-8 bg-surface-container-low border border-outline-variant/40 rounded-2xl p-6">
                  <h3 className="font-semibold text-on-surface mb-3">Professional Bio</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    {profile.description || "No bio set yet."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Edit Modal */}
      <EditProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentProfile={profile}
        profileId={profileId}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
}