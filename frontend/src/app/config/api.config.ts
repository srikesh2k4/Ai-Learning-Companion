/**
 * API Configuration
 * Central place to manage all backend API endpoints
 * Easy to switch between development, production, and other environments
 */

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000' // Change this for production
};

/**
 * API Endpoints Configuration
 * All backend API routes in one place
 */
export const API_CONFIG = {
  // Base URL - Change this when deploying
  BASE_URL: environment.apiUrl,

  // Authentication Endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me'
  },

  // User Endpoints
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE: '/api/user/update',
    STATS: '/api/user/stats',
    DELETE: '/api/user/delete'
  },

  // Chat/Conversation Endpoints
  CHAT: {
    LIST: '/api/conversations',
    CREATE: '/api/conversations',
    GET: (id: number) => `/api/conversations/${id}`,
    DELETE: (id: number) => `/api/conversations/${id}`,
    MESSAGES: (id: number) => `/api/conversations/${id}/messages`,
    SEND_MESSAGE: (id: number) => `/api/conversations/${id}/messages`
  },

  // Practice/Problem Endpoints
  PRACTICE: {
    GENERATE: '/api/problems/generate',
    LIST: '/api/practice-sessions',
    CREATE: '/api/practice-sessions',
    GET: (id: number) => `/api/practice-sessions/${id}`,
    SUBMIT: (id: number) => `/api/practice-sessions/${id}/submit`,
    HISTORY: '/api/practice-sessions/history'
  },

  // AI Agent Endpoints
  AGENT: {
    RECOMMENDATION: '/api/agent/recommendation',
    CHAT: '/api/agent/chat',
    STATS: '/api/agent/stats'
  },

  // Learning Analytics
  ANALYTICS: {
    DASHBOARD: '/api/analytics/dashboard',
    PROGRESS: '/api/analytics/progress',
    PERFORMANCE: '/api/analytics/performance'
  }
};

/**
 * Helper function to get full API URL
 * @param endpoint - The endpoint path
 * @returns Full URL with base URL prepended
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

/**
 * Environment-specific configurations
 * Uncomment and modify for different environments
 */
export const ENVIRONMENTS = {
  development: {
    apiUrl: 'http://localhost:8000',
    wsUrl: 'ws://localhost:8000',
    debug: true
  },
  staging: {
    apiUrl: 'https://staging-api.yourapp.com',
    wsUrl: 'wss://staging-api.yourapp.com',
    debug: true
  },
  production: {
    apiUrl: 'https://api.yourapp.com',
    wsUrl: 'wss://api.yourapp.com',
    debug: false
  }
};

/**
 * Current environment (change this or use environment variables)
 */
export const CURRENT_ENV = ENVIRONMENTS.development;

/**
 * API Headers Configuration
 */
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

/**
 * API Timeout Configuration (in milliseconds)
 */
export const API_TIMEOUT = 30000; // 30 seconds

/**
 * Retry Configuration
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryOn: [408, 500, 502, 503, 504] // HTTP status codes to retry on
};
