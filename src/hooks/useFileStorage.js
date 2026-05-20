import { useState, useRef } from 'react';

export const useFileStorage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [storedFile, setStoredFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png'];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setStoredFile({
          name: file.name,
          type: file.type,
          size: file.size,
          timestamp: Date.now()
        });
      } else {
        alert('Please upload PDF, DOC, DOCX, TXT, or image files only');
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setStoredFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    selectedFile,
    storedFile,
    fileInputRef,
    handleFileSelect,
    handleRemoveFile
  };
};