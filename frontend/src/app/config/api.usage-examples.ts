/**
 * Example: How to update your services to use the centralized API config
 *
 * Before (Hardcoded URLs):
 * -----------------------
 * this.http.get('http://localhost:8000/api/conversations')
 *
 * After (Using API Config):
 * ------------------------
 * import { API_CONFIG, getApiUrl } from '../config/api.config';
 * this.http.get(getApiUrl(API_CONFIG.CHAT.LIST))
 */

// Example 1: Auth Service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, getApiUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceExample {
  constructor(private http: HttpClient) {}

  // Login example
  login(credentials: any) {
    return this.http.post(getApiUrl(API_CONFIG.AUTH.LOGIN), credentials);
  }

  // Register example
  register(userData: any) {
    return this.http.post(getApiUrl(API_CONFIG.AUTH.REGISTER), userData);
  }

  // Get current user
  getCurrentUser() {
    return this.http.get(getApiUrl(API_CONFIG.AUTH.ME));
  }
}

// Example 2: Chat Service
@Injectable({
  providedIn: 'root'
})
export class ChatServiceExample {
  constructor(private http: HttpClient) {}

  // Get all conversations
  getConversations() {
    return this.http.get(getApiUrl(API_CONFIG.CHAT.LIST));
  }

  // Get specific conversation with messages
  getConversation(id: number) {
    return this.http.get(getApiUrl(API_CONFIG.CHAT.GET(id)));
  }

  // Send message
  sendMessage(conversationId: number, message: any) {
    return this.http.post(
      getApiUrl(API_CONFIG.CHAT.SEND_MESSAGE(conversationId)),
      message
    );
  }

  // Delete conversation
  deleteConversation(id: number) {
    return this.http.delete(getApiUrl(API_CONFIG.CHAT.DELETE(id)));
  }
}

// Example 3: AI Agent Service
@Injectable({
  providedIn: 'root'
})
export class AIAgentServiceExample {
  constructor(private http: HttpClient) {}

  // Get recommendation
  getRecommendation(route: string) {
    return this.http.post(getApiUrl(API_CONFIG.AGENT.RECOMMENDATION), {
      current_route: route
    });
  }

  // Chat with AI
  chat(message: string, route: string) {
    return this.http.post(getApiUrl(API_CONFIG.AGENT.CHAT), {
      message,
      current_route: route
    });
  }
}

// Example 4: Practice Service
@Injectable({
  providedIn: 'root'
})
export class PracticeServiceExample {
  constructor(private http: HttpClient) {}

  // Generate problems
  generateProblems(request: any) {
    return this.http.post(getApiUrl(API_CONFIG.PRACTICE.GENERATE), request);
  }

  // Get practice sessions
  getPracticeSessions() {
    return this.http.get(getApiUrl(API_CONFIG.PRACTICE.LIST));
  }

  // Submit answer
  submitAnswer(sessionId: number, answer: any) {
    return this.http.post(
      getApiUrl(API_CONFIG.PRACTICE.SUBMIT(sessionId)),
      answer
    );
  }
}

/**
 * Migration Guide:
 * ---------------
 * 1. Import the config:
 *    import { API_CONFIG, getApiUrl } from '../config/api.config';
 *
 * 2. Replace hardcoded URLs:
 *    Old: 'http://localhost:8000/api/conversations'
 *    New: getApiUrl(API_CONFIG.CHAT.LIST)
 *
 * 3. For dynamic URLs (with IDs):
 *    Old: `http://localhost:8000/api/conversations/${id}`
 *    New: getApiUrl(API_CONFIG.CHAT.GET(id))
 *
 * 4. For production deployment:
 *    - Open api.config.ts
 *    - Change API_CONFIG.BASE_URL to your production URL
 *    - Or use ENVIRONMENTS.production.apiUrl
 */
