const ChatHeader = ({ isAuthenticated, freePromptCount, remainingPrompts, step, selectedCategory, selectedSubcategory, getCategoryLabel }) => {
  return (
    <div className="chatbox-header">
      <h3 className="chatbox-title">LegalEase AI</h3>
      {!isAuthenticated && freePromptCount < 2 && (
        <p className="chatbox-free-count">
          {remainingPrompts} free question{remainingPrompts !== 1 ? 's' : ''} left
        </p>
      )}
      {step === 'chat' && (
        <p className="chatbox-context">
          {getCategoryLabel()} / {selectedSubcategory}
        </p>
      )}
    </div>
  );
};

export default ChatHeader;