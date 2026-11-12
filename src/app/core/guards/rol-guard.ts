import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const rolGuard: CanActivateChildFn = (route, state) => {

    const router = inject(Router);

    const rolesPermitidos = route.data['roles'] as string[] | undefined;

    // Si la ruta no especifica roles, denegar por seguridad.
    if (!rolesPermitidos) {
        return router.createUrlTree(['/dashboard/perfil']);
    }

    return router.createUrlTree(['/dashboard/perfil']);
};