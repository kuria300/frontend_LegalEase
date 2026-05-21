// src/pages/lawyer/LawyerSupportPage.jsx
import { useState } from "react";
import { Send, MessageSquare, HelpCircle, Loader2 } from "lucide-react";

export default function LawyerSupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, message, role: "LAWYER" }),
      });

      if (!response.ok) throw new Error("Ticket submission failed");
      setSent(true);
      setSubject("");
      setMessage("");
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Contact Form */}
      <div className="md:col-span-2 bg-white border border-[#e4e7ec] rounded-[14px] p-6 shadow-sm">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-[#101828]">Contact Support</h1>
          <p className="text-sm text-[#667085] mt-0.5">Submit a message to our administrator assistance team</p>
        </div>

        {sent && (
          <div className="p-3 mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-sm font-medium">
            Your support request has been received. We will get back to you via email shortly!
          </div>
        )}

        <form onSubmit={handleSubmitTicket} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#344054]">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Payout issue, Calendar booking mismatch"
              className="w-full mt-1 px-3 py-2 border border-[#e4e7ec] rounded-lg text-sm focus:outline-none focus:border-[#000f26]"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#344054]">Message Description</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your query in full detail here..."
              className="w-full mt-1 px-3 py-2 border border-[#e4e7ec] rounded-lg text-sm focus:outline-none focus:border-[#000f26] resize-none"
              required
            />
          </div>
          <button type="submit" disabled={sending} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#000f26] hover:bg-[#00173d] disabled:bg-slate-300 transition-colors border-none cursor-pointer">
            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            Send Message
          </button>
        </form>
      </div>

      {/* Helpful Quick Links/FAQ Column */}
      <div className="space-y-4">
        <div className="bg-[#f8f9fc] border border-[#e4e7ec] rounded-[14px] p-5">
          <div className="flex items-center gap-2 mb-3 text-[#000f26]">
            <HelpCircle size={18} />
            <h3 className="text-sm font-bold text-[#101828]">Platform FAQs</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-[#344054]">When do I receive client payouts?</p>
              <p className="text-xs text-[#667085] mt-0.5">Payouts are settled directly to registered M-Pesa channels within 24 hours of session completion.</p>
            </div>
            <div className="pt-2 border-t border-[#e4e7ec]">
              <p className="text-xs font-semibold text-[#344054]">How do clients call me?</p>
              <p className="text-xs text-[#667085] mt-0.5">At the calendar booking hour, an internal link will activate right inside your Dashboard panel.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
