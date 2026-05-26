import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatBox from './ChatBox';
import { useToggleChat } from "../../../utils/toggleChat"


const FloatingChatButton = () => {
  // const [isOpen, setIsOpen] = useState(false);

  // export const toggleChat = () => {
  //   setIsOpen(!isOpen);
  // };
    const { isOpen, toggleChatState, setIsOpen } = useToggleChat();


  const openChat = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const handleOpenChat = () => {
      openChat();
    };

    window.addEventListener('openChatPopup', handleOpenChat);

    return () => {
      window.removeEventListener('openChatPopup', handleOpenChat);
    };
  }, []);

  return (
    <>
    <div className="fixed bottom-8 right-20 z-50 flex flex-col items-center">
         {!isOpen && ( <p className='bg-primary p-2 px-4 text-on-primary rounded-xl rounded-br-none mr-1 transition'>Ask any legal questions!</p>)}
           
          <button
          onClick={toggleChatState}
          className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-container transition-all z-50 group"
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <MessageCircle size={24} />
          )}
        </button>
          </div>
      

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-up">
          <ChatBox />
        </div>
      )}
    </>
  );
};

export default FloatingChatButton;