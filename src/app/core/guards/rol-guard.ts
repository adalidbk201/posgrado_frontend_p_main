
import { inject } from '@angular/core';
import {
    CanActivateChildFn,
    Router
} from '@angular/router';

import { catchError, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { UsuariosService } from '../../features/usuarios/services/usuarios.service';

export const rolGuard: CanActivateChildFn = (route, state) => {

    const authService = inject(AuthService);
    const usuariosService = inject(UsuariosService);
    const router = inject(Router);

    // Roles permitidos para la ruta actual
    const rolesPermitidos = route.data['roles'] as string[] | undefined;

    // Si no se configuraron permisos, denegar acceso
    if (!rolesPermitidos) {
        return router.createUrlTree(['/dashboard/perfil']);
    }

    /**
     * Comprueba si el usuario tiene permiso.
     */
    const validarAcceso = (rolesUsuario: string[]) => {

        const tienePermiso = rolesPermitidos.some(
            rol => rolesUsuario.includes(rol)
        );

        if (tienePermiso) {
            return true;
        }

        return router.createUrlTree(['/dashboard/perfil']);
    };

    /**
     * Si ya tenemos los roles cargados,
     * no necesitamos consultar nuevamente el backend.
     */
    if (authService.rolesCargados()) {
        return validarAcceso(authService.roles());
    }

    /**
     * Si se recargó el navegador,
     * obtenemos nuevamente el perfil.
     */
    return usuariosService.obtenerPerfil().pipe(

        map(respuesta => {

            const roles = respuesta.Data.roles.map(
                rol => rol.rol
            );

            // Guardamos los roles en AuthService
            authService.guardarRoles(roles);

            // Comprobamos los permisos
            return validarAcceso(roles);
        }),

        catchError(error => {

            console.error(
                'Error al obtener el perfil para validar permisos:',
                error
            );

            authService.limpiarToken();

            return of(
                router.createUrlTree(['/login'])
            );
        })
    );
};
