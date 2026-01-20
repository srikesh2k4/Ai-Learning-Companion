/**
 * Environment Configuration for Production Deployment
 *
 * DEPLOYMENT INSTRUCTIONS:
 * =======================
 *
 * 1. For Development (localhost):
 *    - No changes needed
 *    - Backend runs on http://localhost:8000
 *
 * 2. For Production Deployment:
 *    - Replace BASE_URL with your production backend URL
 *    - Example: 'https://api.yourapp.com'
 *    - Or: 'https://your-backend.herokuapp.com'
 *
 * 3. For Docker Deployment:
 *    - Use environment variables
 *    - See Docker section below
 */

// ============================================
// QUICK CONFIGURATION - CHANGE THESE VALUES
// ============================================

/**
 * Set to true when deploying to production
 */
export const IS_PRODUCTION = false;

/**
 * Backend API URL - Change this for deployment
 */
export const BACKEND_URL = IS_PRODUCTION
  ? 'https://your-production-api.com'  // 👈 CHANGE THIS for production
  : 'http://localhost:8000';            // Development URL

// ============================================
// ENVIRONMENT CONFIGURATIONS
// ============================================

export interface Environment {
  name: string;
  production: boolean;
  apiUrl: string;
  wsUrl?: string;
  debug: boolean;
  apiTimeout: number;
}

export const environments: Record<string, Environment> = {
  // Local Development
  development: {
    name: 'Development',
    production: false,
    apiUrl: 'http://localhost:8000',
    wsUrl: 'ws://localhost:8000',
    debug: true,
    apiTimeout: 30000
  },

  // Staging/Testing Environment
  staging: {
    name: 'Staging',
    production: false,
    apiUrl: 'https://staging-api.yourapp.com',
    wsUrl: 'wss://staging-api.yourapp.com',
    debug: true,
    apiTimeout: 30000
  },

  // Production Environment
  production: {
    name: 'Production',
    production: true,
    apiUrl: 'https://api.yourapp.com',
    wsUrl: 'wss://api.yourapp.com',
    debug: false,
    apiTimeout: 45000
  }
};

/**
 * Current Active Environment
 */
export const currentEnvironment: Environment = IS_PRODUCTION
  ? environments['production']
  : environments['development'];

// ============================================
// DOCKER DEPLOYMENT CONFIGURATION
// ============================================

/**
 * For Docker deployments, use environment variables:
 *
 * In your Dockerfile or docker-compose.yml:
 *
 * environment:
 *   - API_URL=https://your-backend-api.com
 *   - WS_URL=wss://your-backend-api.com
 *
 * Then access them in Angular:
 * const apiUrl = (window as any).env?.API_URL || 'http://localhost:8000';
 */

// ============================================
// COMMON DEPLOYMENT PLATFORMS
// ============================================

export const DEPLOYMENT_CONFIGS = {
  // Heroku
  heroku: {
    apiUrl: 'https://your-app.herokuapp.com',
    note: 'Replace "your-app" with your Heroku app name'
  },

  // Vercel/Netlify (Frontend) + Railway/Render (Backend)
  vercel: {
    apiUrl: 'https://your-backend.railway.app',
    note: 'Use Railway/Render URL for backend'
  },

  // AWS
  aws: {
    apiUrl: 'https://api.your-domain.com',
    note: 'Use your AWS API Gateway or EC2 URL'
  },

  // Google Cloud
  gcp: {
    apiUrl: 'https://your-project.appspot.com',
    note: 'Use your Google Cloud Run or App Engine URL'
  },

  // Azure
  azure: {
    apiUrl: 'https://your-app.azurewebsites.net',
    note: 'Use your Azure App Service URL'
  },

  // DigitalOcean
  digitalocean: {
    apiUrl: 'https://your-droplet-ip:8000',
    note: 'Use your droplet IP or domain'
  }
};

// ============================================
// QUICK DEPLOYMENT CHECKLIST
// ============================================

/**
 * DEPLOYMENT CHECKLIST:
 *
 * □ 1. Change IS_PRODUCTION to true
 * □ 2. Update BACKEND_URL with production URL
 * □ 3. Update CORS settings in backend
 * □ 4. Enable HTTPS for production
 * □ 5. Set environment variables
 * □ 6. Test all API endpoints
 * □ 7. Check authentication flow
 * □ 8. Verify WebSocket connections (if used)
 * □ 9. Monitor error logs
 * □ 10. Set up proper error handling
 */

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get API URL based on environment
 */
export function getApiBaseUrl(): string {
  // Check for environment variable (Docker/Cloud)
  if (typeof window !== 'undefined') {
    const envApiUrl = (window as any).env?.API_URL;
    if (envApiUrl) return envApiUrl;
  }

  return currentEnvironment.apiUrl;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return currentEnvironment.production;
}

/**
 * Get debug mode status
 */
export function isDebugMode(): boolean {
  return currentEnvironment.debug;
}

/**
 * Log only in development
 */
export function devLog(...args: any[]): void {
  if (isDebugMode()) {
    console.log('[DEV]', ...args);
  }
}
