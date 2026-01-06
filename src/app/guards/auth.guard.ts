import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { AuthProxyService } from '../services/auth-proxy.service';

export const AuthGuard: CanActivateFn = () => {
    const authService = inject(AuthProxyService);
    const router = inject(Router);

    return authService.isAuthenticatedUser().pipe(
        map(isAuthenticated => {
            if (isAuthenticated) {
                return true;
            } else {
                return router.parseUrl('/login');
            }
        })
    );
};