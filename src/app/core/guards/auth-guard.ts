import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {

  // injectamos el servicio de autenticación y el router
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si existe el token
  if (authService.estaAutenticado()) {
    return true;
  }

  // Si no existe token, redirigir al login
  return router.createUrlTree(['/login']);
};
