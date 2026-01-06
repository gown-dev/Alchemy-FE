import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { AuthProxyService } from '../services/auth-proxy.service';

export const AdminGuard: CanActivateFn = () => {
    const authService = inject(AuthProxyService);
    const router = inject(Router);

    return authService.isAdminUser().pipe(
        map(isAdmin => {
            if (isAdmin) {
                return true;
            } else {
                return router.parseUrl('/login');
            }
        })
    );
};