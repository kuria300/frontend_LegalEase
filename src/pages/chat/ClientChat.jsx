import React from 'react'
import Footer from "../../components/layout/Footer"
import ClientNavbar from '../../components/layout/client/ClientNavbar'
import ChatBox from "../../components/ui/Chat/ChatBox"

const ClientChat = () => {
  return (
    <section className="flex flex-col min-h-screen">
      <ClientNavbar />
      <div className="flex flex-col flex-1 border-t border-outline-variant w-full" />
      <main className="flex-1 flex items-center justify-center p-4 [background:linear-gradient(to_bottom_right,rgba(253,230,138,0.15),rgba(254,243,199,0.1))]">
        <div className="w-full h-full max-w-6xl mx-auto [&_.chatbox-container]:w-full [&_.chatbox-container]:max-w-full [&_.chatbox-container]:h-[calc(100vh-180px)] md:[&_.chatbox-container]:h-[calc(100vh-140px)] max-[480px]:[&_.chatbox-container]:h-[calc(100vh-120px)]">
          <ChatBox />
        </div>
      </main>
      <Footer />
    </section>
  )
}

export default ClientChat