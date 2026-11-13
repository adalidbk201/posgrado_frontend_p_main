import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
 
import { rolGuard } from './core/guards/rol-guard';

export const routes: Routes = [
    {
        path:'inicio',
        loadComponent:()=>import('./pages/inicio/inicio').then((m)=>m.Inicio),
    },
    {
        path:'login',
        loadComponent:()=>import('./features/auth/pages/login/login').then((m)=>m.Login)
    },
    {
        path:'dashboard',
        loadComponent:()=>import('./layout/dashboard/dashboard').then((m)=>m.Dashboard), 

        // 🔐 Proteger Dashboard
        canActivate: [authGuard],
        canActivateChild: [authGuard,rolGuard],

        children:[
            /** Home Datos del Perfil */
            {
                path:'perfil',
                loadComponent:()=>import('./features/usuarios/pages/perfil-usuario/perfil-usuario').then((m)=>m.PerfilUsuario),
                data: {
                    roles: ['ADMINISTRADOR', 'ESTUDIANTE']
                },
            },
            

            /** Personas */
            {
                path:'personas',
                loadComponent:()=>import('./features/personas/pages/lista-personas/lista-personas').then((m)=>m.ListaPersonas),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            

            {
                path:'personas/crear',
                loadComponent:()=>import('./features/personas/pages/crear-persona/crear-persona').then((m)=>m.CrearPersona),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'personas/editar/:id',
                loadComponent:()=>import('./features/personas/pages/editar-persona/editar-persona').then((m)=>m.EditarPersona),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },



            /** Usuarios */
            {
                path:'usuarios',
                loadComponent:()=>import('./features/usuarios/pages/lista-usuarios/lista-usuarios').then((m)=>m.ListaUsuarios),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'usuarios/crear',
                loadComponent:()=>import('./features/usuarios/pages/crear-usuario/crear-usuario').then((m)=>m.CrearUsuario),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'usuarios/editar/:id',
                loadComponent:()=>import('./features/usuarios/pages/editar-usuario/editar-usuario').then((m)=>m.EditarUsuario),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            // Activar usuario
            {
                path: 'usuarios/activar/:usuario',
                loadComponent: () =>
                    import('./features/usuarios/pages/activar-usuario/activar-usuario')
                        .then((m) => m.ActivarUsuario),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            // Subir foto de usuario
            {
                path:'usuarios/foto-usuario',
                loadComponent:()=>import('./features/usuarios/pages/foto-usuario/foto-usuario').then((m)=>m.FotoUsuario),
                data: {
                    roles: ['ADMINISTRADOR', 'ESTUDIANTE']
                },
            },
            // Actualizar Password
            {
                path:'usuarios/actualizarPassword',
                loadComponent:()=>import('./features/usuarios/pages/actualizar-password-perfil/actualizar-password-perfil').then((m)=>m.ActualizarPasswordPerfil),
                data: {
                    roles: ['ADMINISTRADOR', 'ESTUDIANTE']
                },
            },
            // Recuperar Cuenta
            {   
                path:'usuarios/recuperarCuenta/:email',
                loadComponent:()=>import('./features/usuarios/pages/recuperarCuenta/recuperarCuenta').then((m)=>m.RecuperarCuenta),
                data: {
                    roles: ['ADMINISTRADOR', 'ESTUDIANTE']
                },
            },
            // Validar Recuperacion
            {
                path:'usuarios/validarRecuperacion',
                loadComponent:()=>import('./features/usuarios/pages/validar-recuperacion/validar-recuperacion').then((m)=>m.ValidarRecuperacion),
                data: {
                    roles: ['ADMINISTRADOR', 'ESTUDIANTE']
                },
            },



            /** Roles */
            {
                path:'roles',
                loadComponent:()=>import('./features/roles/pages/lista-roles/lista-roles').then((m)=>m.ListaRoles),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'roles/crear',
                loadComponent:()=>import('./features/roles/pages/crear-rol/crear-rol').then((m)=>m.CrearRol),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'roles/editar/:id',
                loadComponent:()=>import('./features/roles/pages/editar-rol/editar-rol').then((m)=>m.EditarRol),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            


            /** Grados Academicos */
            {
                path:'grados',
                loadComponent:()=>import('./features/grados/pages/lista-grados/lista-grados').then((m)=>m.ListaGrados),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'grados/crear',
                loadComponent:()=>import('./features/grados/pages/crear-grado/crear-grado').then((m)=>m.CrearGrado),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'grados/editar/:id',
                loadComponent:()=>import('./features/grados/pages/editar-grado/editar-grado').then((m)=>m.EditarGrado),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },



            /** Menciones */
            {
                path:'menciones',
                loadComponent:()=>import('./features/menciones/pages/lista-menciones/lista-menciones').then((m)=>m.ListaMenciones),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'menciones/crear',
                loadComponent:()=>import('./features/menciones/pages/crear-mencion/crear-mencion').then((m)=>m.CrearMencion),
                data: {
                    roles: ['ADMINISTRADOR']
                },

            },
            {
                path:'menciones/editar/:id',
                loadComponent:()=>import('./features/menciones/pages/editar-mencion/editar-mencion').then((m)=>m.EditarMencion),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },


            /** Programas */
            {
                path:'programas',
                loadComponent:()=>import('./features/programas/pages/lista-programas/lista-programas').then((m)=>m.ListaProgramas),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'programas/crear',
                loadComponent:()=>import('./features/programas/pages/crear-programa/crear-programa').then((m)=>m.CrearPrograma),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'programas/editar/:id',
                loadComponent:()=>import('./features/programas/pages/editar-programa/editar-programa').then((m)=>m.EditarPrograma),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },



            /** Salas */
            {
                path:'salas',
                loadComponent:()=>import('./features/salas/pages/lista-salas/lista-salas').then((m)=>m.ListaSalas),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            // Crear sala
            {
                path: 'salas/crear',
                loadComponent: () =>
                    import('./features/salas/pages/crear-sala/crear-sala')
                        .then((m) => m.CrearSala),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            // Editar sala
            {
                path: 'salas/editar/:id/:nombre_sala',
                loadComponent: () =>
                    import('./features/salas/pages/editar-sala/editar-sala')
                        .then((m) => m.EditarSala),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },




            /** Niveles */
            {
                path:'niveles',
                loadComponent:()=>import('./features/niveles/pages/lista-niveles/lista-niveles').then((m)=>m.ListaNiveles),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'niveles/crear',
                loadComponent:()=>import('./features/niveles/pages/crear-nivel/crear-nivel').then((m)=>m.CrearNivel),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'niveles/editar/:id/:numero_nivel/:nombre_nivel/:filas/:columnas/:id_sala/:nombre_sala',
                loadComponent:()=>import('./features/niveles/pages/editar-nivel/editar-nivel').then((m)=>m.EditarNivel),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },


            /** Butacas */
            {
                path:'butacas',
                loadComponent:()=>import('./features/butacas/pages/lista-butacas/lista-butacas').then((m)=>m.ListaButacas),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'butacas/crear',
                loadComponent:()=>import('./features/butacas/pages/crear-butaca/crear-butaca').then((m)=>m.CrearButaca),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'butacas/editar/:id/:id_nivel',
                loadComponent:()=>import('./features/butacas/pages/editar-butaca/editar-butaca').then((m)=>m.EditarButaca),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },


            /** Titulados */
            {
                path:'titulados',
                loadComponent:()=>import('./features/titulados/pages/lista-titulados/lista-titulados').then((m)=>m.ListaTitulados),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'titulados/crear',
                loadComponent:()=>import('./features/titulados/pages/crear-titulado/crear-titulado').then((m)=>m.CrearTitulado),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'titulados/editar/:id',
                loadComponent:()=>import('./features/titulados/pages/editar-titulado/editar-titulado').then((m)=>m.EditarTitulado),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },




            /** Colaciones */
            {
                path:'colaciones',
                loadComponent:()=>import('./features/colaciones/pages/lista-colaciones/lista-colaciones').then((m)=>m.ListaColaciones),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'colaciones/crear',
                loadComponent:()=>import('./features/colaciones/pages/crear-colacion/crear-colacion').then((m)=>m.CrearColacion),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'colaciones/editar/:id',
                loadComponent:()=>import('./features/colaciones/pages/editar-colacion/editar-colacion').then((m)=>m.EditarColacion),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },


            

            /** Asignacion Butacas */
            {
                path:'asignaciones',
                loadComponent:()=>import('./features/asignaciones/pages/lista-asignaciones/lista-asignaciones').then((m)=>m.ListaAsignaciones),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'asignaciones/crear',
                loadComponent:()=>import('./features/asignaciones/pages/crear-asignacion/crear-asignacion').then((m)=>m.CrearAsignacion),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'asignaciones/editar/:id',
                loadComponent:()=>import('./features/asignaciones/pages/editar-asignacion/editar-asignacion').then((m)=>m.EditarAsignacion),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },


            /** Asistencias */
            {
                path:'asistencias',
                loadComponent:()=>import('./features/asistencias/pages/lista-asistencias/lista-asistencias').then((m)=>m.ListaAsistencias),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'asistencias/crear',
                loadComponent:()=>import('./features/asistencias/pages/crear-asistencia/crear-asistencia').then((m)=>m.CrearAsistencia),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'asistencias/editar/:id/:nombre',
                loadComponent:()=>import('./features/asistencias/pages/editar-asistencia/editar-asistencia').then((m)=>m.EditarAsistencia),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            

            /** Comunicados */
            {
                path:'comunicados',
                loadComponent:()=>import('./features/comunicados/pages/lista-comunicados/lista-comunicados').then((m)=>m.ListaComunicados),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'comunicados/crear',
                loadComponent:()=>import('./features/comunicados/pages/crear-comunicado/crear-comunicado').then((m)=>m.CrearComunicado),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },
            {
                path:'comunicados/editar/:id',
                loadComponent:()=>import('./features/comunicados/pages/editar-comunicado/editar-comunicado').then((m)=>m.EditarComunicado),
                data: {
                    roles: ['ADMINISTRADOR']
                },
            },



            {
                path:'**',
                redirectTo:'perfil'
            }
        ]
    },
 
    {
        path:'**',
        redirectTo:'inicio'
    }
];
