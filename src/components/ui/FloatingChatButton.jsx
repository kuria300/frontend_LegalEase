import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatBox from './ChatBox';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

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
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-container transition-all z-50 group"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-up">
          <ChatBox />
        </div>
      )}
    </>
  );
};

export default FloatingChatButton;