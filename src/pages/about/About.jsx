import { Scale, MessageCircle, Users, Smartphone, LayoutDashboard, Globe, Coins, ShieldCheck, Lightbulb, Lock, ArrowLeft } from "lucide-react";
import Footer from "../../components/layout/Footer";
import { useNavigate } from "react-router-dom";

const offerings = [
  {
    icon: <MessageCircle size={20} />,
    title: "AI legal chatbot",
    desc: "Ask any legal question in plain English, 24/7. Get structured responses covering Kenyan law, your rights, and recommended next steps across five practice areas.",
  },
  {
    icon: <Users size={20} />,
    title: "Verified lawyer marketplace",
    desc: "Browse verified, licensed Kenyan lawyers filtered by specialty, location, availability, and pricing. Transparent, trustworthy connections — no cold calls.",
  },
  {
    icon: <Smartphone size={20} />,
    title: "Seamless booking & payments",
    desc: "Book a consultation in minutes and pay securely using M-Pesa — the payment method over 32 million Kenyans already trust. No bank account required.",
  },
  {
    icon: <LayoutDashboard size={20} />,
    title: "Personal legal dashboard",
    desc: "Track consultations, upload legal documents, store case notes, and receive structured post-consultation summaries — all in one secure place.",
  },
];

const values = [
  { icon: <Globe size={20} />, title: "Accessibility", desc: "Digital-first, mobile-friendly, and built around the tools Kenyans already use." },
  { icon: <Coins size={20} />, title: "Affordability", desc: "Free AI chatbot. Transparent lawyer pricing. No surprises." },
  { icon: <ShieldCheck size={20} />, title: "Trust & integrity", desc: "Every lawyer is verified and credential-reviewed. We don't guess — we verify." },
  { icon: <Lightbulb size={20} />, title: "Empowerment", desc: "We make sure you understand your rights first. An informed citizen is an empowered citizen." },
  { icon: <Lock size={20} />, title: "Privacy & security", desc: "Compliant with Kenya's Data Protection Act (2019). Your legal matters stay private." },
];

export default function AboutPage() {
  const navigate= useNavigate()
  return (
    <div className="min-h-screen bg-surface text-on-surface">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-14 border-b border-outline-variant">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-surface-container text-on-primary-container font-[20px] px-3 py-1.5 rounded-full mb-8 hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} />
          Back to home
        </button>

        <h1 className="text-4xl font-bold text-on-surface leading-tight max-w-2xl mb-5">
          Making the law accessible, affordable, and understandable for every Kenyan.
        </h1>

        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          LegalEase is an AI-powered legal-tech platform built to bridge the gap between ordinary Kenyans and the legal help they deserve.
        </p>
      </section>

      {/* What we offer */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-b border-outline-variant">
        <p className="text-xs font-semibold uppercase tracking-widest text-on-primary-container mb-2">
          What we offer
        </p>
        <h2 className="text-2xl font-bold text-on-surface mb-2">
          Everything you need, in one place
        </h2>
        <p className="text-on-surface-variant mb-8 max-w-xl leading-relaxed">
          Whether you need a quick answer or a full consultation, LegalEase has you covered — at every step of your legal journey.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {offerings.map((o) => (
            <div
              key={o.title}
              className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 hover:bg-surface-container transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-surface-container-high text-on-primary-container rounded-xl flex items-center justify-center mb-4">
                {o.icon}
              </div>
              <h3 className="font-semibold text-on-surface mb-2">{o.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-on-primary-container mb-2">
          Our values
        </p>
        <h2 className="text-2xl font-bold text-on-surface mb-2">
          What we stand for
        </h2>
        <p className="text-on-surface-variant mb-8 max-w-xl leading-relaxed">
          Everything we build is guided by a simple idea — the law should work for people, not against them.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 hover:bg-surface-container-low transition-colors duration-200"
            >
              <div className="w-9 h-9 bg-surface-container-high text-on-primary-container rounded-lg flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <h3 className="font-semibold text-on-surface mb-1">{v.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
     <Footer />
    </div>
  );
}