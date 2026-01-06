import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthProxyService } from '../services/auth-proxy.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private readonly WHITELISTED_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

  constructor(private authService: AuthProxyService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    console.debug(`--- AuthInterceptor.intercept() ---`);
    console.debug(`Intercepted request (${request.url}).`);

    const isWhitelisted = this.WHITELISTED_PATHS.some(path => request.url.includes(path));

    if (isWhitelisted) {
      console.debug("Request whitelisted - No Authorization token injection required.");
      return next.handle(request);
    }

    console.debug("Request requires Authorization - Injecting Authorization tokens.");
    let tokenCall: Observable<string | undefined> = this.authService.getBearerToken();

    return tokenCall.pipe(
      switchMap(authToken => {
        let authRequest = request;

        if (authToken !== undefined) {
          authRequest = request.clone({
            headers: new HttpHeaders({
              'Authorization': `Bearer ${authToken}`
            })
          });
        }

        return next.handle(authRequest);
      })
    );
  }
}