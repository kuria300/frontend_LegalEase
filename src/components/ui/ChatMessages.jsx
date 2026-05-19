import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatMessages = ({ messages, isLoading, showLawyerButton, redirectToLawyers, messagesEndRef }) => {
  return (
    <div className="chatbox-messages">
      {messages.length === 0 ? (
        <div className="chatbox-empty-state">
          Ask your question to get started
        </div>
      ) : (
        <>
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg.text} isUser={msg.isUser} />
          ))}
          {isLoading && <TypingIndicator />}
        </>
      )}
      
      {showLawyerButton && (
        <div className="chatbox-lawyer-btn-container">
          <button onClick={redirectToLawyers} className="chatbox-lawyer-btn">
            Speak to a verified lawyer
          </button>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;