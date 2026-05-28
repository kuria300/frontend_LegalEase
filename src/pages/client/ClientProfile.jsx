import { useState, useEffect } from "react";
import {Pencil,Mail,Phone,Calendar,X,Loader2,Trash2,ShieldCheck} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ClientSidebar from "../../components/layout/client/ClientSidebar.jsx";
import { useAuth } from "../../hooks/useAuth";
import { baseUrl } from "../../config/Baseurl.js";

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

  const {url}=baseUrl()

//Skeleton
function ProfileSkeleton() {
  return (
    <div className="w-full bg-surface border border-outline-variant rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-28 bg-gray-200" />
      <div className="px-6 md:px-12 pb-8">
        <div className="-mt-12 flex flex-col gap-5">
          <div className="w-28 h-28 rounded-full bg-gray-300 border-4 border-white" />
          <div className="flex flex-col gap-2">
            <div className="h-7 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-100 rounded w-28" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
          <div className="h-28 bg-gray-200 rounded-2xl" />
          <div className="h-28 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

//Info Card 

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="font-semibold text-on-surface">{title}</h3>
      </div>
      <p className="text-on-surface-variant text-sm">{value || "Not set"}</p>
    </div>
  );
}

//Edit Profile Modal

function EditProfileModal({ isOpen, onClose, currentClient, onSave }) {
  const [form, setForm] = useState({
    first_name:  "",
    second_name: "",
    email:       "",
    dob:         "",
  });
  const [saving, setSaving] = useState(false);



  useEffect(() => {
    if (currentClient) {
      setForm({
        first_name:  currentClient.first_name  || "",
        second_name: currentClient.second_name || "",
        email:       currentClient.email       || "",
        dob:         currentClient.dob
          ? new Date(currentClient.dob).toISOString().split("T")[0]
          : "",
      });
    }
  }, [currentClient, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.first_name || !form.second_name || !form.email) {
      toast.error("Name and email are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.put(
        `${url}/api/user/update`,
        {
          first_name:  form.first_name,
          second_name: form.second_name,
          email:       form.email,
          dob:         form.dob || undefined,
        },
        { headers: authHeader() }
      );

      onSave(res.data.data || res.data);
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
    { name: "first_name",  label: "First Name",    type: "text", placeholder: "e.g. John" },
    { name: "second_name", label: "Last Name",      type: "text", placeholder: "e.g. Doe" },
    { name: "email",       label: "Email Address",  type: "email", placeholder: "e.g. john@email.com" },
    { name: "dob",         label: "Date of Birth",  type: "date", placeholder: "" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold text-on-surface mb-1">Edit Profile</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Update your personal information.
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
        </div>

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

//Delete Confirm Modal

function DeleteAccountModal({ isOpen, onClose, onConfirm, deleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>

        <h2 className="text-lg font-bold text-on-surface text-center mb-1">
          Delete Account
        </h2>
        <p className="text-sm text-on-surface-variant text-center mb-6">
          This action is permanent and cannot be undone. All your data will be deleted.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface-variant/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting && <Loader2 size={15} className="animate-spin" />}
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

//Main Component

const ClientProfile = () => {
  const { user, loading: authLoading, Logout } = useAuth();
  const navigate = useNavigate();

  const [client, setClient]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);

        if (!user?.id) throw new Error("Not authenticated");
        const res = await axios.get(`${url}/api/user/get`, {
          headers: authHeader(),
        });

        const data = res.data.data || res.data;

        setClient({
          id:          data.id,
          first_name:  data.first_name  || user.first_name  || "",
          second_name: data.second_name || user.second_name || "",
          email:       data.email       || user.email       || "",
          dob:         data.dob         || null,
          created_at:  data.created_at  || null,
        });
      } catch (err) {
        console.error("Client profile fetch error:", err);
        setError("Failed to load profile. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authLoading, user]);

  const handleProfileSave = (updatedData) => {
    setClient((prev) => ({ ...prev, ...updatedData }));
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${url}/api/user/delete`, {
        headers: authHeader(),
      });

      toast.success("Account deleted successfully.");
      // Log out and redirect
      sessionStorage.setItem("logged_out", "true");
      localStorage.removeItem("token");

      navigate("/login", { replace: true });


    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to delete account.");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const initials = client
    ? `${client.first_name?.[0] || ""}${client.second_name?.[0] || ""}`.toUpperCase()
    : "";

  const fullName = client
    ? `${client.first_name} ${client.second_name}`.trim()
    : "";

  const formatDate = (dateStr) => {
    if (!dateStr) return "Not set";
    return new Date(dateStr).toLocaleDateString("en-KE", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const joinedDate = client?.created_at
    ? new Date(client.created_at).toLocaleDateString("en-KE", {
        year: "numeric", month: "long",
      })
    : "—";

  return (
    <div className="min-h-screen bg-surface-container/50 flex flex-col md:flex-row">
      <ClientSidebar />

      <main className="md:ml-64 w-full md:flex-1 transition-all duration-300 min-h-screen">
        <section className="w-full max-w-7xl mx-auto flex flex-col items-start justify-start gap-8 py-8 px-6">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-on-surface mb-2">
              Client Profile
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant">
              Manage your personal information and account settings.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-sm font-medium w-full">
              {error}
            </div>
          )}

          {/* Skeleton */}
          {(authLoading || loading) && <ProfileSkeleton />}

          {/* Real content */}
          {!authLoading && !loading && !error && client && (
            <div className="w-full bg-surface border border-outline-variant rounded-2xl shadow-sm overflow-hidden">

              {/* Banner */}
              <div className="h-28 bg-primary/10 relative">
                <button
                  onClick={() => setModalOpen(true)}
                  className="absolute top-6 right-6 flex items-center gap-2 bg-surface hover:bg-surface-container text-on-surface text-sm font-medium px-4 py-2 rounded-xl border border-outline-variant transition-all"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              </div>

              <div className="px-6 md:px-12 pb-8">

                {/* Avatar + Name */}
                <div className="-mt-12 flex flex-col items-start gap-5">
                  <div className="w-28 h-28 rounded-full bg-primary border-4 border-surface flex items-center justify-center shadow-md">
                    <span className="text-white text-3xl font-bold">{initials}</span>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
                      {fullName}
                    </h2>
                    <p className="text-on-surface-variant mt-1">LegalEase Client</p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
                  <InfoCard
                    icon={<Mail className="w-5 h-5 text-primary" />}
                    title="Email Address"
                    value={client.email}
                  />
                  <InfoCard
                    icon={<ShieldCheck className="w-5 h-5 text-primary" />}
                    title="Account Role"
                    value={client.role || user?.role || "CLIENT"}
                    disabled
                  />
                  <InfoCard
                    icon={<Calendar className="w-5 h-5 text-primary" />}
                    title="Date of Birth"
                    value={formatDate(client.dob)}
                  />
                  <InfoCard
                    icon={<Calendar className="w-5 h-5 text-primary" />}
                    title="Member Since"
                    value={joinedDate}
                  />
                </div>

                {/* Delete Account */}
                <div className="mt-10 border border-red-100 bg-red-50/50 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-red-600 text-sm">
                      Delete Account
                    </h3>
                    <p className="text-xs text-red-400 mt-0.5">
                      Permanently remove your account and all associated data. This cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteOpen(true)}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
                  >
                    <Trash2 size={15} />
                    Delete Account
                  </button>
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
        currentClient={client}
        onSave={handleProfileSave}
      />

      {/* Delete Confirm Modal */}
      <DeleteAccountModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        deleting={deleting}
      />
    </div>
  );
};

export default ClientProfile;