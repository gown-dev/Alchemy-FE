import { Injectable, Injector } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse, TokenResponse } from '../api/models';
import { AuthService } from '../api/services';

@Injectable({
    providedIn: 'root'
})
export class AuthProxyService {

    private readonly ACCESS_TOKEN_KEY = 'alchemy-access-token';
    private readonly REFRESH_TOKEN_KEY = 'alchemy-refresh-token';

    constructor(private authService: AuthService, private injector: Injector) { }

    register(username: string, password: string): Observable<TokenResponse> {
        return this.authService.register({ body: { username: username, password: password } });
    }

  login(username: string, password: string): Observable<number> {
      // Will either return a number or let the error bubble up.
      return this.authService.login({ body: { username: username, password: password } }).pipe(
          tap((token) => {
              console.debug("Storing tokens.");
              localStorage.setItem(this.ACCESS_TOKEN_KEY, token.accessToken!);
              localStorage.setItem(this.REFRESH_TOKEN_KEY, token.refreshToken!);
          }),
          map(() => {
              console.debug("Login successful.");
              return 200;
          }),
      );
    }

    getBearerToken(): Observable<string | undefined> {
        console.debug(`--- AuthProxyService.getBearerToken() ---`);
        console.debug("Looking for access token in local storage.");
        let accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);

        if (accessToken === null) {
            console.debug("Access token not found, looking for refresh token in local storage.");
            let refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

            if (refreshToken === null) {
                console.debug("No token found, unauthenticated.");
                return of(undefined);
            }

            return this.authService.refresh({ body: { refreshToken: refreshToken } }).pipe(map(response => {
                if (response.accessToken === undefined) {
                    console.error("Refresh call failed to return an access token. Please refresh and log-in again.");
                    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
                    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
                    return undefined;
                } else {
                    console.debug("Refresh call success : access and refresh tokens stored in local storage.");
                    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
                    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken || refreshToken);
                    return response.accessToken;
                }
            }));
        } else {
            console.debug("Access token found.");
            return of(accessToken);
        }
    }

    isKnownUser(): boolean {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY) != null || localStorage.getItem(this.REFRESH_TOKEN_KEY) != null;
    }

    isAuthenticatedUser(): Observable<boolean> {
        return this.getBearerToken().pipe(
            map(token => token !== undefined)
        );
    }

    isAdminUser(): Observable<boolean> {
        return this.authService.account().pipe(
            map(response => {
                if (response.account == undefined) return false;
                return (response.account.roles ?? []).includes("ADMIN");
            })
        );
    }

}
