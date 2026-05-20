import { useState, useEffect } from 'react';
import ChatService from '../services/chatService';

export const useChatState = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [freePromptCount, setFreePromptCount] = useState(0);
  const [step, setStep] = useState('category');
  const [error, setError] = useState(null);

  const isAuthenticated = !!localStorage.getItem('token');
  const hasReachedLimit = !isAuthenticated && freePromptCount >= 2;
  const remainingPrompts = 2 - freePromptCount;

  useEffect(() => {
    const savedCount = localStorage.getItem('freePromptCount');
    if (savedCount !== null) {
      setFreePromptCount(parseInt(savedCount));
    }
  }, []);

  const handleCategorySelect = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setStep('subcategory');
    setError(null);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setStep('chat');
    setError(null);
  };

  const handleBackToCategories = () => {
    setStep('category');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setError(null);
  };

  const handleBackToSubcategories = () => {
    setStep('subcategory');
    setSelectedSubcategory('');
    setError(null);
  };

  const getCategoryLabel = () => {
    const categories = {
      employment: "Employment Issues",
      property: "Property & Land",
      family: "Family Law",
      business: "Business & Contracts",
      criminal: "Criminal Matters",
      other: "Other Legal Issues"
    };
    return categories[selectedCategory] || selectedCategory;
  };

  const sendMessage = async (message, file = null) => {
    if (!message.trim() && !file) return;
    if (hasReachedLimit) return;
    
    const msgToSend = message || (file ? `Uploaded document: ${file.name}` : '');
    
    setInputMessage('');
    setError(null);
    
    if (!isAuthenticated) {
      const newCount = freePromptCount + 1;
      setFreePromptCount(newCount);
      localStorage.setItem('freePromptCount', newCount.toString());
    }
    
    setMessages(prev => [...prev, { 
      text: msgToSend, 
      isUser: true 
    }]);
    setIsLoading(true);
    
    try {
      const response = await ChatService.sendMessage(
        message, 
        selectedCategory, 
        selectedSubcategory,
        file
      );
      
      const aiReply = response.reply || response.message || response.analysis || 'No response from AI';
      setMessages(prev => [...prev, { text: aiReply, isUser: false }]);
    } catch (err) {
      console.error('Error:', err);
      if (err.message === 'You have reached your message limit. Please register.') {
        setError('You have reached the message limit. Please register to continue.');
      } else if (err.message === 'Too many requests. Please try again later.') {
        setError('Too many requests. Please wait a moment before sending more messages.');
      } else {
        setError(err.message || 'Sorry, I encountered an error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};