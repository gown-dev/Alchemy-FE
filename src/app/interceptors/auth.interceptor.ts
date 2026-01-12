import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import {concatMap, Observable, switchMap} from 'rxjs';
import { AuthProxyService } from '../services/auth-proxy.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authProxyService = inject(AuthProxyService);

  return authProxyService.getBearerToken().pipe(
    concatMap(token => {

    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(clonedRequest);
    }

    return next(req);
  }));

};

