import Footer from "../../components/layout/Footer"
import HomeNavbar from "../../components/layout/HomeNavbar"
import { BadgeCheck, Clock, Banknote, Zap } from "lucide-react"

function HomePage(){
  return(
    <>
      <section className="home-container flex flex-col min-h-screen">
        <HomeNavbar />
        <div className="border-t border-outline-variant w-full"/>
        <main className="flex-1">
          {/* section 1 */}
          <section className="Hero-container">
            <div className="left-hero_section">
              <h1 className="text-primary text-6xl font-bold tracking-tight leading-[1.2]">
                Understand Your Rights.
                <br/>
                <span className="text-secondary text-6xl">Get Legal Help Instantly. </span>
              </h1>
              <p className="opacity-80 text-on-surface-variant text-xl">
                Navigating the Kenyan legal system shouldn't be confusing.
                LegalEase provides accessible, professional guidance—starting
                with our intelligent AI assistant and connecting you to verified advocates when you need them.
              </p>
              <div className="home-btn_collection">
                <button className="btn-AI">Start AI consultation</button>
                <button className="btn-lawyers">Browse Lawyers</button>
              </div>
            </div>
            <div className="right-hero_section">
              <div className="chatbot-section">
                {/* <ChatBox /> */}
              </div>
            </div>
          </section>

          {/* section 3 */}
          <section className="bg-background py-8">
            <div className="max-w-7xl mx-auto px-12">
              <div className="legal-container_section">
                <h2 className="text-3xl font-semibold tracking-tight text-primary mt-4 mb-1">
                  Why Choose LegalEase?
                </h2>
                <p className="text-on-surface-variant">
                  Making legal services accessible to all Kenyans
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="box-card_section">
                  <BadgeCheck className="text-secondary mb-2"/>
                  <h4 className="text-primary mb-2 font-medium">Verified Lawyers</h4>
                  <p className="text-[14px] text-on-surface-variant">All our advocates are LSK-certified and thoroughly vetted.</p>
                </div>
                <div className="box-card_section">
                  <Clock className="text-secondary mb-2"/>
                  <h4 className="text-primary mb-2 font-medium">24/7 Availability</h4>
                  <p className="text-[14px] text-on-surface-variant">Our AI assistant is ready to help any time of day or night.</p>
                </div>
                <div className="box-card_section">
                  <Banknote className="text-secondary mb-2"/>
                  <h4 className="text-primary mb-2 font-medium">Transparent Pricing</h4>
                  <p className="text-[14px] text-on-surface-variant">Upfront costs with no hidden fees. Pay easily through mobile money.</p>
                </div>
                <div className="box-card_section">
                  <Zap className="text-secondary mb-2"/>
                  <h4 className="text-primary mb-2 font-medium">Instant Responses</h4>
                  <p className="text-[14px] text-on-surface-variant">AI-powered preliminary research gives you answers in seconds.</p>
                </div>
              </div>
            </div>
          </section>

          {/* section 4 */}
          <section className="max-w-4xl mx-auto mb-6 max-sm:px-8">
            <div className="bg-primary rounded-xl p-8 md:p-12 lg:p-16 text-on-primary text-center">
              <h2 className="text-[32px] md:text-[42px] mb-4">
                Ready to Get Started?
              </h2>
              <p className="mb-10 opacity-90 max-w-2xl mx-auto">
                Join thousands of Kenyans who have found legal clarity with LegalEase. Your first AI consultation is free.
              </p>
              <button className="bg-secondary text-on-secondary-fixed rounded-xl px-10 py-4 font-bold hover:bg-secondary-container">
                Create Free Account
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </section>
    </>
  )
}

export default HomePage