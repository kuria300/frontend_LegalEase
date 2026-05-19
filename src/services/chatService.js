const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ChatService {
  async sendMessage(query, file = null) {
    const formData = new FormData();
    formData.append('query', query);
    
    if (file) {
      formData.append('document', file);
    }

    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat/query`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  }

  async getChatHistory() {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Chat history error:', error);
      throw error;
    }
  }
}

export default new ChatService();