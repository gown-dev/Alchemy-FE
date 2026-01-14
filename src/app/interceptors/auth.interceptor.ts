import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import {concatMap, Observable, switchMap} from 'rxjs';
import { AuthProxyService } from '../services/auth-proxy.service';

const WHITELISTED_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const isWhitelisted = WHITELISTED_PATHS.some(path => request.url.includes(path));

  if (isWhitelisted) {
    return next(request);
  }

  const authProxyService = inject(AuthProxyService);

  return authProxyService.getBearerToken().pipe(
    concatMap(token => {

    if (token) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(clonedRequest);
    }

    return next(request);
  }));

};

