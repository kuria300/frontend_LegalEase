import { useState } from 'react';

export const useToggleChat = () => {
const [isOpen, setIsOpen] = useState(false);

  const toggleChatState = () => {

    setIsOpen(!isOpen);

    
  };

    return { isOpen , toggleChatState , setIsOpen};
}