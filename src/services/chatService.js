const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ChatService {
  async sendMessage(message, category, subcategory, file = null) {
    const token = localStorage.getItem('token');

    // If there's a file, just store it in localStorage - don't upload yet
    if (file) {
      const base64 = await this.fileToBase64(file);
      localStorage.setItem('pending_document', JSON.stringify({
        name: file.name,
        type: file.type,
        data: base64
      }));
    }

    // Always use public endpoint if no token
    if (!token) {
      const response = await fetch(`${API_BASE_URL}/chat/message/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, category, subcategory }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }

      return await response.json();
    }

    // User is logged in - check for pending document and upload it
    const pendingDoc = localStorage.getItem('pending_document');
    if (pendingDoc) {
      const docData = JSON.parse(pendingDoc);
      const result = await this.uploadDocument(docData, token);
      localStorage.removeItem('pending_document');
      return result;
    }

    // Logged in, no file - use authenticated endpoint
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message, category, subcategory }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    return await response.json();
  }

  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  async uploadDocument(docData, token) {
    const response = await fetch(docData.data);
    const blob = await response.blob();
    const file = new File([blob], docData.name, { type: docData.type });

    const formData = new FormData();
    formData.append('document', file);

    const uploadResponse = await fetch(`${API_BASE_URL}/chat/upload-document`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      throw new Error(error.message || 'Failed to upload document');
    }

    return await uploadResponse.json();
  }

  async getChatHistory(userId) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/chat/history/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch chat history');

    return await response.json();
  }
}

export default new ChatService();