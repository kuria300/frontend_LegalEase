import Footer from "../../components/layout/Footer"
import HomeNavbar from "../../components/layout/HomeNavbar"
//import ChatBox from "../../components/chat/Chatbot"

function HomePage() {
  // Create a custom event to trigger the floating chat button
  const triggerChatPopup = () => {
    // Dispatch a custom event that FloatingChatButton can listen to
    window.dispatchEvent(new CustomEvent('openChatPopup'));
  };

  return (
    <>
      <section className="home-container flex flex-col min-h-screen">
        <HomeNavbar />

        <main className="flex-1">
          <section className="Hero-container">
            <div className="left-hero_section">
              <h1 className="text-primary text-5xl font-bold tracking-tight leading-[1.2]"> 
                Understand Your Rights. 
                <br /> 
                <span className="text-secondary text-5xl">Get Legal Help Instantly.</span>
              </h1>

              <p className="opacity-80 text-on-surface-variant text-xl">
                Navigating the Kenyan legal system shouldn't be confusing. 
                LegalEase provides accessible, professional guidance—starting 
                with our intelligent AI assistant and connecting you to verified advocates when you need them.
              </p>
              <div className="home-btn_collection">
                {/* Button now opens floating chat popup */}
                <button onClick={triggerChatPopup} className="btn-AI">
                  Start AI consultation
                </button>
                <button className="btn-lawyers">Browse Lawyers</button>
              </div>
            </div>
          </section>   
        </main>

        <Footer />
      </section>
    </>
  );
}

export default HomePage;