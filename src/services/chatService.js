const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ChatService {
  async sendMessage(message, category, subcategory, file = null) {
    const token = localStorage.getItem('token');
    
    // If there's a file, use FormData to upload endpoint (requires auth)
    if (file) {
      const formData = new FormData();
      formData.append('message', message || '');
      formData.append('category', category);
      formData.append('subcategory', subcategory);
      formData.append('document', file);
      
      const response = await fetch(`${API_BASE_URL}/chat/upload-document`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload document');
      }

      const data = await response.json();
      return data;
    }
    
    // No file - use JSON to public endpoint
    const response = await fetch(`${API_BASE_URL}/chat/message/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        message: message,
        category: category,
        subcategory: subcategory,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    const data = await response.json();
    return data;
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

    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }

    const data = await response.json();
    return data;
  }
}

export default new ChatService();