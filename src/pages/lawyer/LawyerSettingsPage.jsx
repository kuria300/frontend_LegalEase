// src/pages/lawyer/LawyerSettingsPage.jsx
import { useState, useEffect } from "react";
import { Save, Shield, DollarSign, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function LawyerSettingsPage() {
  const [fee, setFee] = useState("");
  const [passwordData, setPasswordData] = useState({ current: "", newPassword: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // 'success' or 'error'

  useEffect(() => {
    // Fetch current consultation rate configuration
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/lawyer/settings", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (response.ok) {
          const data = await response.json();
          setFee(data.fee || "");
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveRate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/lawyer/settings/rate", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fee: Number(fee) }),
      });

      if (!response.ok) throw new Error("Could not update consultation rate");
      setStatus({ type: "success", message: "Consultation rate updated successfully!" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirm) {
      setStatus({ type: "error", message: "New passwords do not match" });
      return;
    }
    // API Call logic to /api/lawyer/settings/password goes here identically...
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#101828]">Settings</h1>
        <p className="text-sm text-[#667085] mt-1">Configure your consultation rates and account security</p>
      </div>

      {status.message && (
        <div className={`p-4 mb-4 rounded-lg border flex items-center gap-2 text-sm ${
          status.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{status.message}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Rate Settings */}
        <form onSubmit={handleSaveRate} className="bg-white border border-[#e4e7ec] rounded-[14px] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="text-[#000f26]" size={20} />
            <h2 className="text-base font-bold text-[#101828]">Consultation Fees</h2>
          </div>
          <div className="max-w-xs">
            <label className="text-xs font-semibold text-[#344054]">Hourly Rate (KSh)</label>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-[#e4e7ec] rounded-lg text-sm focus:outline-none focus:border-[#000f26]"
              placeholder="e.g. 5000"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#000f26] hover:bg-[#00173d] disabled:bg-slate-300 transition-colors cursor-pointer border-none">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Rate
          </button>
        </form>

        {/* Security Settings */}
        <form onSubmit={handlePasswordChange} className="bg-white border border-[#e4e7ec] rounded-[14px] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-[#000f26]" size={20} />
            <h2 className="text-base font-bold text-[#101828]">Change Password</h2>
          </div>
          <div className="space-y-3 max-w-sm">
            <div>
              <label className="text-xs font-semibold text-[#344054]">Current Password</label>
              <input type="password" required className="w-full mt-1 px-3 py-2 border border-[#e4e7ec] rounded-lg text-sm focus:outline-none focus:border-[#000f26]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#344054]">New Password</label>
              <input type="password" required className="w-full mt-1 px-3 py-2 border border-[#e4e7ec] rounded-lg text-sm focus:outline-none focus:border-[#000f26]" />
            </div>
          </div>
          <button type="submit" className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#000f26] hover:bg-[#00173d] transition-colors cursor-pointer border-none">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
