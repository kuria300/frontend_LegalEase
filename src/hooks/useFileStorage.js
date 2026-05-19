import { useState, useEffect, useRef } from 'react';

export const useFileStorage = () => {  // ← 'export' HERE
  const [selectedFile, setSelectedFile] = useState(null);
  const [storedFile, setStoredFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedFile = localStorage.getItem('pendingFile');
    if (savedFile) {
      try {
        const fileData = JSON.parse(savedFile);
        setStoredFile(fileData);
      } catch (e) {
        console.error('Error loading stored file:', e);
      }
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png'];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileData = {
            name: file.name,
            type: file.type,
            size: file.size,
            base64: reader.result,
            timestamp: Date.now()
          };
          localStorage.setItem('pendingFile', JSON.stringify(fileData));
          setStoredFile(fileData);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload PDF, DOC, DOCX, TXT, or image files only');
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setStoredFile(null);
    localStorage.removeItem('pendingFile');
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