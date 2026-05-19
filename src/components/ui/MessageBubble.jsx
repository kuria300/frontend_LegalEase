import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message, isUser }) => {
  return (
    <div className={`chatbox-message ${isUser ? 'user' : 'ai'}`}>
      <div className={`chatbox-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
        {isUser ? (
          <p className="chatbox-message-text">{message}</p>
        ) : (
          <div className="chatbox-markdown">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;