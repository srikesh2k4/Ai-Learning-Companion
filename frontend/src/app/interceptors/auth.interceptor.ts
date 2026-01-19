import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Only add auth header in browser
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const token = authService.getToken();

  // Skip auth header for login, register and public endpoints
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/register') && !req.url.includes('/topics')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only handle 401 in browser and not on auth endpoints
      if (error.status === 401 && isPlatformBrowser(platformId) && !req.url.includes('/auth/')) {
        console.log('401 error - logging out');
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
