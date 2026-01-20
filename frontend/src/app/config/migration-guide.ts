/**
 * 🔄 MIGRATION SCRIPT
 * Quick reference to update all your existing services
 * Copy-paste the imports and replace URLs
 */

// ============================================
// STEP 1: Add this import to all services
// ============================================

import { API_CONFIG, getApiUrl } from '../config/api.config';

// ============================================
// STEP 2: Find and Replace Patterns
// ============================================

/**
 * Pattern 1: Simple GET/POST/PUT/DELETE
 * ----------------------------------------
 * OLD: 'http://localhost:8000/api/auth/login'
 * NEW: getApiUrl(API_CONFIG.AUTH.LOGIN)
 */

/**
 * Pattern 2: URLs with IDs
 * ----------------------------------------
 * OLD: `http://localhost:8000/api/conversations/${id}`
 * NEW: getApiUrl(API_CONFIG.CHAT.GET(id))
 */

/**
 * Pattern 3: Query Parameters
 * ----------------------------------------
 * OLD: `http://localhost:8000/api/conversations?page=${page}`
 * NEW: getApiUrl(API_CONFIG.CHAT.LIST) + `?page=${page}`
 * OR:  getApiUrl(`${API_CONFIG.CHAT.LIST}?page=${page}`)
 */

// ============================================
// QUICK REPLACEMENTS BY FILE
// ============================================

/**
 * auth.service.ts
 * ---------------
 */
export const AUTH_SERVICE_REPLACEMENTS = {
  // Login
  OLD_1: `'http://localhost:8000/api/auth/login'`,
  NEW_1: `getApiUrl(API_CONFIG.AUTH.LOGIN)`,

  // Register
  OLD_2: `'http://localhost:8000/api/auth/register'`,
  NEW_2: `getApiUrl(API_CONFIG.AUTH.REGISTER)`,

  // Get Current User
  OLD_3: `'http://localhost:8000/api/auth/me'`,
  NEW_3: `getApiUrl(API_CONFIG.AUTH.ME)`,

  // Logout
  OLD_4: `'http://localhost:8000/api/auth/logout'`,
  NEW_4: `getApiUrl(API_CONFIG.AUTH.LOGOUT)`
};

/**
 * learning.service.ts
 * -------------------
 */
export const LEARNING_SERVICE_REPLACEMENTS = {
  // Get Conversations
  OLD_1: `'http://localhost:8000/api/conversations'`,
  NEW_1: `getApiUrl(API_CONFIG.CHAT.LIST)`,

  // Create Conversation
  OLD_2: `'http://localhost:8000/api/conversations'`,
  NEW_2: `getApiUrl(API_CONFIG.CHAT.CREATE)`,

  // Get Single Conversation
  OLD_3: `\`http://localhost:8000/api/conversations/\${id}\``,
  NEW_3: `getApiUrl(API_CONFIG.CHAT.GET(id))`,

  // Delete Conversation
  OLD_4: `\`http://localhost:8000/api/conversations/\${id}\``,
  NEW_4: `getApiUrl(API_CONFIG.CHAT.DELETE(id))`,

  // Get Messages
  OLD_5: `\`http://localhost:8000/api/conversations/\${id}/messages\``,
  NEW_5: `getApiUrl(API_CONFIG.CHAT.MESSAGES(id))`,

  // Send Message
  OLD_6: `\`http://localhost:8000/api/conversations/\${id}/messages\``,
  NEW_6: `getApiUrl(API_CONFIG.CHAT.SEND_MESSAGE(id))`,

  // Generate Problems
  OLD_7: `'http://localhost:8000/api/problems/generate'`,
  NEW_7: `getApiUrl(API_CONFIG.PRACTICE.GENERATE)`,

  // Practice Sessions
  OLD_8: `'http://localhost:8000/api/practice-sessions'`,
  NEW_8: `getApiUrl(API_CONFIG.PRACTICE.LIST)`,

  // Submit Answer
  OLD_9: `\`http://localhost:8000/api/practice-sessions/\${sessionId}/submit\``,
  NEW_9: `getApiUrl(API_CONFIG.PRACTICE.SUBMIT(sessionId))`
};

/**
 * user.service.ts
 * ---------------
 */
export const USER_SERVICE_REPLACEMENTS = {
  // Get Profile
  OLD_1: `'http://localhost:8000/api/user/profile'`,
  NEW_1: `getApiUrl(API_CONFIG.USER.PROFILE)`,

  // Update Profile
  OLD_2: `'http://localhost:8000/api/user/update'`,
  NEW_2: `getApiUrl(API_CONFIG.USER.UPDATE)`,

  // Get Stats
  OLD_3: `'http://localhost:8000/api/user/stats'`,
  NEW_3: `getApiUrl(API_CONFIG.USER.STATS)`
};

/**
 * ai-agent.service.ts
 * -------------------
 */
export const AI_AGENT_SERVICE_REPLACEMENTS = {
  // Get Recommendation
  OLD_1: `'http://localhost:8000/api/agent/recommendation'`,
  NEW_1: `getApiUrl(API_CONFIG.AGENT.RECOMMENDATION)`,

  // Chat with Agent
  OLD_2: `'http://localhost:8000/api/agent/chat'`,
  NEW_2: `getApiUrl(API_CONFIG.AGENT.CHAT)`
};

// ============================================
// AUTOMATED FIND & REPLACE (VS Code)
// ============================================

/**
 * Use VS Code Find & Replace (Cmd+Shift+H or Ctrl+Shift+H)
 *
 * 1. Enable Regex mode (.*) button
 * 2. Search in: src/app/services/
 * 3. Use these patterns:
 */

export const VSCODE_FIND_REPLACE = [
  {
    description: 'Find all localhost:8000 URLs',
    find: `'http://localhost:8000/api/([^']+)'`,
    info: 'This will find all hardcoded localhost URLs'
  },
  {
    description: 'Find template string URLs',
    find: '`http://localhost:8000/api/([^`]+)`',
    info: 'This will find all template string URLs with variables'
  }
];

// ============================================
// VERIFICATION CHECKLIST
// ============================================

export const MIGRATION_CHECKLIST = [
  '✅ 1. Import API_CONFIG in all service files',
  '✅ 2. Replace auth service URLs',
  '✅ 3. Replace learning service URLs',
  '✅ 4. Replace user service URLs',
  '✅ 5. Replace AI agent service URLs',
  '✅ 6. Test each endpoint after migration',
  '✅ 7. Check for any remaining localhost:8000',
  '✅ 8. Run ng build to check for errors',
  '✅ 9. Test in browser DevTools',
  '✅ 10. Update production URL when ready'
];

// ============================================
// SEARCH FOR REMAINING HARDCODED URLS
// ============================================

/**
 * Run this in terminal to find any remaining hardcoded URLs:
 *
 * # Search for localhost:8000
 * grep -r "localhost:8000" src/app/services/
 *
 * # Search for http://
 * grep -r "http://" src/app/services/ | grep -v "config"
 *
 * # Search for https://
 * grep -r "https://" src/app/services/ | grep -v "config"
 */

// ============================================
// TESTING AFTER MIGRATION
// ============================================

/**
 * Test each service method:
 *
 * 1. Open browser DevTools (F12)
 * 2. Go to Network tab
 * 3. Test each feature:
 *    - Login/Register
 *    - Chat conversations
 *    - Practice problems
 *    - User profile
 *    - AI agent
 * 4. Verify all requests go to correct URLs
 * 5. Check for any 404 errors
 */

// ============================================
// EXAMPLE: COMPLETE SERVICE FILE
// ============================================

/**
 * Example of a fully migrated service file:
 */

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG, getApiUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  constructor(private http: HttpClient) {}

  // ✅ All methods now use centralized config
  getConversations(): Observable<any> {
    return this.http.get(getApiUrl(API_CONFIG.CHAT.LIST));
  }

  getConversation(id: number): Observable<any> {
    return this.http.get(getApiUrl(API_CONFIG.CHAT.GET(id)));
  }

  createConversation(data: any): Observable<any> {
    return this.http.post(getApiUrl(API_CONFIG.CHAT.CREATE), data);
  }

  sendMessage(conversationId: number, message: any): Observable<any> {
    return this.http.post(
      getApiUrl(API_CONFIG.CHAT.SEND_MESSAGE(conversationId)),
      message
    );
  }

  deleteConversation(id: number): Observable<any> {
    return this.http.delete(getApiUrl(API_CONFIG.CHAT.DELETE(id)));
  }
}
*/

// ============================================
// BENEFITS AFTER MIGRATION
// ============================================

/**
 * ✨ Benefits:
 *
 * 1. ✅ One place to change backend URL
 * 2. ✅ Easy switch between dev/prod
 * 3. ✅ No more scattered URLs
 * 4. ✅ Type-safe endpoints
 * 5. ✅ Better maintainability
 * 6. ✅ Easier testing
 * 7. ✅ Clear API documentation
 * 8. ✅ Faster deployment
 */
