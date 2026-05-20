const TypingIndicator = () => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-sm bg-gray-100">
      <div className="flex gap-1.5 items-center">
        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default TypingIndicator;