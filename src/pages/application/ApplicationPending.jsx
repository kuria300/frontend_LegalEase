import { Link } from "react-router-dom"
import HomeNavbar from "../../components/layout/HomeNavbar"
import Footer from "../../components/layout/Footer"

export default function ApplicationPending() {
  return (
    <div className="home-container flex flex-col min-h-screen">
      <HomeNavbar />

      <main className="flex-1 flex justify-center items-center px-4 pt-32 pb-20">
        <div className="w-full max-w-lg">

          {/* Success card */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 overflow-hidden shadow-sm">
            
            {/* Header Area */}
            <div className="bg-primary px-8 py-12 flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center mb-2">
                <svg className="w-10 h-10 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-on-primary text-3xl font-bold mb-3">Application Submitted!</h1>
                <p className="text-on-primary/80 text-sm max-w-sm mx-auto leading-relaxed">
                  We've successfully received your proffesional details and practicing certificate.
                </p>
              </div>
            </div>

            {/* Email Notification Note & Action */}
            <div className="px-8 py-10 flex flex-col items-center text-center gap-8">
              <div className="flex flex-col items-center gap-4">
                <svg className="w-8 h-8 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <p className="text-sm text-on-surface leading-relaxed max-w-sm">
                  Our team will review your LSK credentials shortly. <strong>We will send you an email</strong> as soon as your account is verified and ready to use.
                </p>
              </div>
              
              <Link 
                to="/" 
                className="w-full bg-surface-container border border-outline-variant text-on-surface py-3.5 px-6 rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-colors"
              >
                Return to Homepage
              </Link>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}