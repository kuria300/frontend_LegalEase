import { useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import CategorySelection from './CategorySelection';
import SubcategorySelection from './SubcategorySelection';
import { useChatState } from '../../../hooks/useChatState';
import { useFileStorage } from '../../../hooks/useFileStorage';
import { useChatRedirects } from '../../../utils/chatRedirects';
import { Paperclip, X, Send } from 'lucide-react';

const ChatBox = () => {
  const messagesEndRef = useRef(null);
  const { redirectToRegister, redirectToLogin, redirectToLawyers } = useChatRedirects();
  
  const {
    messages,
    inputMessage,
    setInputMessage,
    selectedCategory,
    selectedSubcategory,
    isLoading,
    step,
    error,
    isAuthenticated,
    hasReachedLimit,
    remainingPrompts,
    freePromptCount,
    handleCategorySelect,
    handleSubcategorySelect,
    handleBackToCategories,
    handleBackToSubcategories,
    getCategoryLabel,
    sendMessage,
    setError
  } = useChatState();

  const {
    selectedFile,
    storedFile,
    fileInputRef,
    handleFileSelect,
    handleRemoveFile
  } = useFileStorage();

  const handleSend = () => {
    sendMessage(inputMessage, selectedFile);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !selectedFile) {
      e.preventDefault();
      handleSend();
    }
  };

  const showLawyerButton = messages.length > 0 && messages[messages.length - 1] && 
    !messages[messages.length - 1].isUser && !hasReachedLimit;

  return (
    <div className="chatbox-container">
      <ChatHeader 
        isAuthenticated={isAuthenticated}
        freePromptCount={freePromptCount}
        remainingPrompts={remainingPrompts}
        step={step}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        getCategoryLabel={getCategoryLabel}
      />

      <div className="chatbox-content">
        <div className="chatbox-disclaimer">
          AI assistant — not legal advice
        </div>

        {step === 'category' && (
          <CategorySelection onSelectCategory={handleCategorySelect} />
        )}

        {step === 'subcategory' && (
          <>
            <div className="chatbox-back-header">
              <button onClick={handleBackToCategories} className="chatbox-back-btn">
                ←
              </button>
              <p className="chatbox-section-title">
                Select specific issue for {getCategoryLabel()}:
              </p>
            </div>
            <SubcategorySelection 
              category={selectedCategory} 
              onSelectSubcategory={handleSubcategorySelect} 
            />
          </>
        )}

        {step === 'chat' && (
          <ChatMessages 
            messages={messages}
            isLoading={isLoading}
            showLawyerButton={showLawyerButton}
            redirectToLawyers={redirectToLawyers}
            messagesEndRef={messagesEndRef}
          />
        )}
      </div>

      <div className="chatbox-input-area">
        {hasReachedLimit ? (
          <div className="chatbox-limit-options">
            <p className="chatbox-limit-message">You've used your 2 free questions!</p>
            <button onClick={redirectToRegister} className="chatbox-register-btn">
              Create an account
            </button>
            <button onClick={redirectToLogin} className="chatbox-login-btn">
              Login to existing account
            </button>
          </div>
        ) : step === 'chat' ? (
          <div className="chatbox-input-wrapper">
            {selectedFile && (
              <div className="chatbox-file-preview">
                <span className="chatbox-file-name">{selectedFile.name}</span>
                <button onClick={handleRemoveFile} className="chatbox-file-remove">
                  <X size={16} />
                </button>
              </div>
            )}
            
            <div className="chatbox-input-row">
              {isAuthenticated ? (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,image/jpeg,image/png"
                    className="chatbox-file-input"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="chatbox-attach-btn">
                    <Paperclip size={18} />
                  </label>
                </>
              ) : (
                <button
                  onClick={redirectToLogin}
                  className="chatbox-attach-btn-login"
                  title="Login to upload documents"
                >
                  <Paperclip size={18} />
                </button>
              )}
              
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${selectedSubcategory.toLowerCase()}...`}
                className="chatbox-text-input"
              />
              <button
                onClick={handleSend}
                disabled={(!inputMessage.trim() && !selectedFile) || isLoading}
                className="chatbox-send-btn"
              >
                <Send size={18} />
              </button>
            </div>
            
            {!isAuthenticated && (
              <div className="text-center mt-2">
                <p className="text-xs text-gray-400">
                  <button onClick={redirectToLogin} className="text-blue-500 hover:underline">Login</button> to upload documents and get AI analysis
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="chatbox-prompt-hint">
            Select a category to continue
          </div>
        )}
        
        {error && <div className="chatbox-error">{error}</div>}
      </div>
    </div>
  );
};

export default ChatBox;