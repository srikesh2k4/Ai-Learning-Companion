# 🚀 API Configuration & Deployment Guide

## 📁 File Structure

```
frontend/src/app/config/
├── api.config.ts              # All API endpoints in one place
├── environment.config.ts      # Environment settings (dev/prod)
└── api.usage-examples.ts      # How to use in services
```

---

## ⚡ Quick Start

### 1. Development (Default)
No changes needed! Backend runs on `http://localhost:8000`

### 2. Production Deployment

**Option A: Simple One-Line Change**
```typescript
// Open: frontend/src/app/config/api.config.ts
// Change line 14:
export const API_CONFIG = {
  BASE_URL: 'https://your-backend.com',  // 👈 Change this!
  // ... rest stays the same
};
```

**Option B: Use Environment Config**
```typescript
// Open: frontend/src/app/config/environment.config.ts
// Change line 32:
export const IS_PRODUCTION = true;  // 👈 Set to true

// Change line 38:
export const BACKEND_URL = IS_PRODUCTION
  ? 'https://your-backend.com'  // 👈 Change this!
  : 'http://localhost:8000';
```

---

## 📋 Complete API Endpoints Reference

### Authentication
```typescript
API_CONFIG.AUTH.REGISTER    // POST /api/auth/register
API_CONFIG.AUTH.LOGIN       // POST /api/auth/login
API_CONFIG.AUTH.LOGOUT      // POST /api/auth/logout
API_CONFIG.AUTH.ME          // GET  /api/auth/me
```

### User Management
```typescript
API_CONFIG.USER.PROFILE     // GET  /api/user/profile
API_CONFIG.USER.UPDATE      // PUT  /api/user/update
API_CONFIG.USER.STATS       // GET  /api/user/stats
```

### Chat/Conversations
```typescript
API_CONFIG.CHAT.LIST                    // GET  /api/conversations
API_CONFIG.CHAT.CREATE                  // POST /api/conversations
API_CONFIG.CHAT.GET(id)                 // GET  /api/conversations/:id
API_CONFIG.CHAT.DELETE(id)              // DELETE /api/conversations/:id
API_CONFIG.CHAT.MESSAGES(id)            // GET  /api/conversations/:id/messages
API_CONFIG.CHAT.SEND_MESSAGE(id)        // POST /api/conversations/:id/messages
```

### Practice/Problems
```typescript
API_CONFIG.PRACTICE.GENERATE            // POST /api/problems/generate
API_CONFIG.PRACTICE.LIST                // GET  /api/practice-sessions
API_CONFIG.PRACTICE.GET(id)             // GET  /api/practice-sessions/:id
API_CONFIG.PRACTICE.SUBMIT(id)          // POST /api/practice-sessions/:id/submit
```

### AI Agent
```typescript
API_CONFIG.AGENT.RECOMMENDATION         // POST /api/agent/recommendation
API_CONFIG.AGENT.CHAT                   // POST /api/agent/chat
```

---

## 🔧 How to Use in Services

### Example: Update Auth Service

**Before:**
```typescript
// auth.service.ts
login(credentials: any) {
  return this.http.post('http://localhost:8000/api/auth/login', credentials);
}
```

**After:**
```typescript
// auth.service.ts
import { API_CONFIG, getApiUrl } from '../config/api.config';

login(credentials: any) {
  return this.http.post(getApiUrl(API_CONFIG.AUTH.LOGIN), credentials);
}
```

### Example: Update Chat Service

**Before:**
```typescript
getConversation(id: number) {
  return this.http.get(`http://localhost:8000/api/conversations/${id}`);
}
```

**After:**
```typescript
import { API_CONFIG, getApiUrl } from '../config/api.config';

getConversation(id: number) {
  return this.http.get(getApiUrl(API_CONFIG.CHAT.GET(id)));
}
```

---

## 🌍 Deployment Platforms

### Heroku
```typescript
BASE_URL: 'https://your-app.herokuapp.com'
```

### Railway
```typescript
BASE_URL: 'https://your-app.railway.app'
```

### Render
```typescript
BASE_URL: 'https://your-app.onrender.com'
```

### Vercel (Frontend) + Railway (Backend)
```typescript
BASE_URL: 'https://your-backend.railway.app'
```

### AWS
```typescript
BASE_URL: 'https://your-api.execute-api.region.amazonaws.com'
```

### DigitalOcean
```typescript
BASE_URL: 'https://your-droplet-ip:8000'
// Or with domain:
BASE_URL: 'https://api.yourdomain.com'
```

---

## 🐳 Docker Deployment

### Using Environment Variables

**1. Add to docker-compose.yml:**
```yaml
services:
  frontend:
    environment:
      - API_URL=https://your-backend.com
```

**2. Update api.config.ts:**
```typescript
export const API_CONFIG = {
  BASE_URL: (window as any).env?.API_URL || 'http://localhost:8000',
  // ... rest of config
};
```

---

## ✅ Deployment Checklist

### Before Deployment:
- [ ] Update `BASE_URL` in `api.config.ts`
- [ ] Set `IS_PRODUCTION = true` in `environment.config.ts`
- [ ] Test all API endpoints with new URL
- [ ] Verify CORS settings in backend
- [ ] Enable HTTPS for production
- [ ] Check authentication flow works

### Backend Setup:
- [ ] Update CORS allowed origins
- [ ] Set up proper environment variables
- [ ] Configure database connection
- [ ] Set up SSL/TLS certificates
- [ ] Test API connectivity

### After Deployment:
- [ ] Test login/logout flow
- [ ] Verify all API calls work
- [ ] Check browser console for errors
- [ ] Monitor error logs
- [ ] Test on mobile devices

---

## 🔍 Testing API Connection

### Quick Test:
```typescript
// In browser console:
fetch('https://your-backend.com/api/auth/me')
  .then(res => res.json())
  .then(data => console.log('API Connected:', data))
  .catch(err => console.error('API Error:', err));
```

### Backend CORS Setup:
```python
# In your FastAPI backend (main.py or index.py):
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",           # Development
        "https://your-frontend.vercel.app" # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🆘 Troubleshooting

### Problem: API calls not working
**Solution:**
1. Check browser console for CORS errors
2. Verify backend URL is correct
3. Ensure backend CORS allows frontend domain
4. Check if backend is running

### Problem: 404 errors
**Solution:**
1. Verify endpoint paths in `api.config.ts`
2. Check backend route definitions
3. Ensure BASE_URL doesn't have trailing slash

### Problem: Authentication not working
**Solution:**
1. Check if JWT tokens are being sent
2. Verify credentials in backend
3. Check token expiration settings

---

## 📞 Need Help?

1. Check the examples in `api.usage-examples.ts`
2. Verify your backend is running
3. Test API endpoints with Postman/Thunder Client
4. Check browser console for errors
5. Review backend logs

---

## 🎯 Summary

**For Development:**
```typescript
// No changes needed!
BASE_URL: 'http://localhost:8000'
```

**For Production:**
```typescript
// Change one line:
BASE_URL: 'https://your-backend.com'
```

**That's it!** All your services will automatically use the new URL.
