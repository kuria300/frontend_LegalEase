import Footer from "../../components/layout/Footer"
import HomeNavbar from "../../components/layout/HomeNavbar"
import { Bot, SendHorizonal, MessageSquare, CalendarCheck, UserRoundSearch, Verified, Clock, Banknote, Zap } from "lucide-react"

function HomePage(){
    return(
        <>
         <section className="home-container flex flex-col min-h-screen">
           <HomeNavbar />
           <div className="border-t border-outline-variant w-full"/>
            <main className="flex-1">
              {/* section 1 */}
              <section className="Hero-container">
                {/* left side information */}
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
                 
                 {/* right side information */}
                 <div className="right-hero_section">
                   <div className="chatbot-section">
                     <div className="bg-primary p-6 flex items-center gap-4 rounded-t-lg text-on-primary">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                          <span><Bot /></span>
                      </div>
                      <div>
                        <p className="font-bold">Legalease AI</p>
                        <p className="text-xs opacity-80">Online</p>
                      </div>
                      </div>
                      <div className="flex-1 bg-surface-container-low flex flex-col gap-6 p-4 overflow-y-auto">
                        <div className="bg-surface-container-highest p-4 rounded-xl rounded-tl-none max-w-[85%]">
                          <p className="text-on-surface">
                            Hello! I can help you understand Kenyan law regarding employment, property, or family matters. What's on your mind?
                          </p>
                        </div>
                        <div className="bg-primary text-on-primary p-4 rounded-xl rounded-tr-none max-w-[85%] self-end">
                           <p className="text-on-primary">What are the requirements for a legal marriage in Kenya?</p>
                        </div>
                      </div>
                     {/* outside scrollble area */}
                      <div className="p-4 border-t border-outline-variant bg-surface flex gap-4">
                           <input className="input-chatbot"
                           placeholder="Type your legal question..." 
                           type="text" 
                           />
                        <button className="btn-chatbot">
                           <SendHorizonal />
                        </button>
                        </div>
                   </div>
                 </div>
              </section>   
              {/* section 2 */}
              <section className='legal-container py-6 max-sm:py-10'>
                <div className="max-w-7xl mx-auto px-12">
                <div className='legal-container_section'>
                  <h2 className='text-3xl font-semibold tracking-tight text-primary mt-4 mb-1'>
                     How LegalEase Works.
                  </h2>
                   <p className='text-on-surface-variant'>
                      Simple,fast and Reliable Legal Assistance
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
 
                   <div className="box-card group">
                      <div className="box-content group-hover:scale-110 mb-3">
                         <MessageSquare className="text-secondary" />
                      </div>
                      <h3 className=" font-medium text-primary mb-2 text-[20px]">Ask Your Question</h3>
                      <p className="text-on-surface-variant">
                        Start a conversation with our AI legal assistant. Get instant answers to your legal questions based on Kenyan law.
                      </p>
                   </div>
                  

                   <div className="box-card group">
                      <div className="box-content group-hover:scale-110 mb-3">
                         <UserRoundSearch className="text-secondary" />
                      </div>
                      <h3 className=" font-medium text-primary mb-2 text-[20px]">Find a lawyer</h3>
                      <p className="text-on-surface-variant">
                        Browse our network of verified lawyers. Filter by specialty, location, and price to find the perfect match.
                      </p>
                   </div>
                  
                   <div className="box-card group">
                      <div className="box-content group-hover:scale-110 mb-3">
                         <CalendarCheck className="text-secondary" />
                      </div>
                      <h3 className=" font-medium text-primary mb-2 text-[20px]">Book & Consult</h3>
                      <p className="text-on-surface-variant">
                        Schedule a consultation at your convenience. Pay securely via M-Pesa and get expert legal advice.
                      </p>
                   </div>

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
                      <Verified className="text-secondary mb-2"/>
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

                  <button className="bg-secondary-container text-on-background rounded-xl px-10 py-4 font-bold hover:bg-secondary-container transition-all">
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