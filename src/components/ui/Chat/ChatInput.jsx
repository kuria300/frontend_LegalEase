import { Paperclip, X, Send } from 'lucide-react';

const ChatInput = ({ 
  inputMessage, 
  setInputMessage, 
  handleSend, 
  handleKeyPress,
  selectedFile,
  handleFileSelect,
  handleRemoveFile,
  isLoading,
  fileInputRef,
  isAuthenticated,
  selectedSubcategory,
  redirectToLogin
}) => {
  return (
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
  );
};

export default ChatInput;