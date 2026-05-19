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
  selectedSubcategory
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
        <p className="text-xs text-gray-400 text-center mt-2">
          Documents you upload will be saved locally until you login
        </p>
      )}
    </div>
  );
};

export default ChatInput;