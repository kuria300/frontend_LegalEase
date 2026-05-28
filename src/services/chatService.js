import { baseUrl } from "../config/Baseurl";

const { url }=baseUrl()
const API_BASE_URL = url

class ChatService {
  async sendMessage(message, category, subcategory, file = null) {
    const token = localStorage.getItem('token');

    // If there's a file AND user is NOT logged in, store it in localStorage for later
    if (file && !token) {
      const base64 = await this.fileToBase64(file);
      localStorage.setItem('pending_document', JSON.stringify({
        name: file.name,
        type: file.type,
        data: base64
      }));
      
      // Return early with a message that document will be analyzed after login
      return { 
        reply: `📎 "${file.name}" has been saved. You have ${2 - this.getFreePromptCount()} free messages remaining. After logging in, this document will be analyzed automatically.` 
      };
    }

    // If there's a file AND user IS logged in, upload it first
    if (file && token) {
      const uploadResult = await this.uploadDocument(file, token);
      return uploadResult;
    }

    // Check for pending document after login
    const pendingDoc = localStorage.getItem('pending_document');
    if (pendingDoc && token) {
      const docData = JSON.parse(pendingDoc);
      const result = await this.uploadDocumentFromBase64(docData, token);
      localStorage.removeItem('pending_document');
      return result;
    }

    // Use public endpoint if no token, authenticated endpoint if token exists
    const endpoint = !token ? `${API_BASE_URL}/api/chat/message/public` : `${API_BASE_URL}/api/chat/message`;
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, category, subcategory }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    return await response.json();
  }

  // Helper to get current free prompt count
  getFreePromptCount() {
    const count = localStorage.getItem('freePromptCount');
    return count ? parseInt(count) : 0;
  }

  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  // Upload document directly
  async uploadDocument(file, token) {
    const formData = new FormData();
    formData.append('document', file);

    const response = await fetch(`${API_BASE_URL}/api/chat/upload-document`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload document');
    }

    return await response.json();
  }

  // Upload document from base64
  async uploadDocumentFromBase64(docData, token) {
    // Convert base64 to blob
    const base64Response = await fetch(docData.data);
    const blob = await base64Response.blob();
    const file = new File([blob], docData.name, { type: docData.type });
    
    return this.uploadDocument(file, token);
  }

  async getChatHistory(userId) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/api/chat/history/${userId}`, {
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
