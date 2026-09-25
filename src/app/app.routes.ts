import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';


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
        canActivateChild: [authGuard],

        children:[
            /** Personas */
            {
                path:'personas',
                loadComponent:()=>import('./features/personas/pages/lista-personas/lista-personas').then((m)=>m.ListaPersonas)
            },
             {
                path:'personas/crear',
                loadComponent:()=>import('./features/personas/pages/crear-persona/crear-persona').then((m)=>m.CrearPersona),
            },
            {
                path:'personas/editar/:id',
                loadComponent:()=>import('./features/personas/pages/editar-persona/editar-persona').then((m)=>m.EditarPersona),
            },



            /** Usuarios */
            {
                path:'usuarios',
                loadComponent:()=>import('./features/usuarios/pages/lista-usuarios/lista-usuarios').then((m)=>m.ListaUsuarios),
            },
            {
                path:'usuarios/crear',
                loadComponent:()=>import('./features/usuarios/pages/crear-usuario/crear-usuario').then((m)=>m.CrearUsuario),
            },
            {
                path:'usuarios/editar/:id',
                loadComponent:()=>import('./features/usuarios/pages/editar-usuario/editar-usuario').then((m)=>m.EditarUsuario),
            },



            /** Roles */
            {
                path:'roles',
                loadComponent:()=>import('./features/roles/pages/lista-roles/lista-roles').then((m)=>m.ListaRoles),
            },
            {
                path:'roles/crear',
                loadComponent:()=>import('./features/roles/pages/crear-rol/crear-rol').then((m)=>m.CrearRol),
            },
            {
                path:'roles/editar/:id',
                loadComponent:()=>import('./features/roles/pages/editar-rol/editar-rol').then((m)=>m.EditarRol),
            },
            


            /** Grados Academicos */
            {
                path:'grados',
                loadComponent:()=>import('./features/grados/pages/lista-grados/lista-grados').then((m)=>m.ListaGrados),
            },
            {
                path:'grados/crear',
                loadComponent:()=>import('./features/grados/pages/crear-grado/crear-grado').then((m)=>m.CrearGrado),
            },
            {
                path:'grados/editar/:id',
                loadComponent:()=>import('./features/grados/pages/editar-grado/editar-grado').then((m)=>m.EditarGrado),
            },



            /** Menciones */
            {
                path:'menciones',
                loadComponent:()=>import('./features/menciones/pages/lista-menciones/lista-menciones').then((m)=>m.ListaMenciones),
            },
            {
                path:'menciones/crear',
                loadComponent:()=>import('./features/menciones/pages/crear-mencion/crear-mencion').then((m)=>m.CrearMencion),

            },
            {
                path:'menciones/editar/:id',
                loadComponent:()=>import('./features/menciones/pages/editar-mencion/editar-mencion').then((m)=>m.EditarMencion),
            },


            /** Programas */
            {
                path:'programas',
                loadComponent:()=>import('./features/programas/pages/lista-programas/lista-programas').then((m)=>m.ListaProgramas)
            },
            {
                path:'programas/crear',
                loadComponent:()=>import('./features/programas/pages/crear-programa/crear-programa').then((m)=>m.CrearPrograma),
            },
            {
                path:'programas/editar/:id',
                loadComponent:()=>import('./features/programas/pages/editar-programa/editar-programa').then((m)=>m.EditarPrograma),
            },



            /** Salas */
            {
                path:'salas',
                loadComponent:()=>import('./features/salas/pages/lista-salas/lista-salas').then((m)=>m.ListaSalas),
            },
            // Crear sala
            {
                path: 'salas/crear',
                loadComponent: () =>
                    import('./features/salas/pages/crear-sala/crear-sala')
                        .then((m) => m.CrearSala),
            },
            // Editar sala
            {
                path: 'salas/editar/:id',
                loadComponent: () =>
                    import('./features/salas/pages/editar-sala/editar-sala')
                        .then((m) => m.EditarSala),
            },




            /** Niveles */
            {
                path:'niveles',
                loadComponent:()=>import('./features/niveles/pages/lista-niveles/lista-niveles').then((m)=>m.ListaNiveles),
            },
            {
                path:'niveles/crear',
                loadComponent:()=>import('./features/niveles/pages/crear-nivel/crear-nivel').then((m)=>m.CrearNivel),
            },
            {
                path:'niveles/editar/:id',
                loadComponent:()=>import('./features/niveles/pages/editar-nivel/editar-nivel').then((m)=>m.EditarNivel),
            },


            /** Butacas */
            {
                path:'butacas',
                loadComponent:()=>import('./features/butacas/pages/lista-butacas/lista-butacas').then((m)=>m.ListaButacas),
            },
            {
                path:'butacas/crear',
                loadComponent:()=>import('./features/butacas/pages/crear-butaca/crear-butaca').then((m)=>m.CrearButaca),
            },
            {
                path:'butacas/editar/:id',
                loadComponent:()=>import('./features/butacas/pages/editar-butaca/editar-butaca').then((m)=>m.EditarButaca),
            },


            /** Titulados */
            {
                path:'titulados',
                loadComponent:()=>import('./features/titulados/pages/lista-titulados/lista-titulados').then((m)=>m.ListaTitulados)
            },




            /** Colaciones */
            {
                path:'colaciones',
                loadComponent:()=>import('./features/colaciones/pages/lista-colaciones/lista-colaciones').then((m)=>m.ListaColaciones),
            },



            

            /** Asignacion Butacas */
            {
                path:'asignaciones',
                loadComponent:()=>import('./features/asignaciones/pages/lista-asignaciones/lista-asignaciones').then((m)=>m.ListaAsignaciones),
            },



            /** Asistencias */
            {
                path:'asistencias',
                loadComponent:()=>import('./features/asistencias/pages/lista-asistencias/lista-asistencias').then((m)=>m.ListaAsistencias)
            },


            /** Comunicados */
            {
                path:'comunicados',
                loadComponent:()=>import('./features/comunicados/pages/lista-comunicados/lista-comunicados').then((m)=>m.ListaComunicados),
            },



            {
                path:'**',
                redirectTo:'personas'
            }
        ]
    },
 
    {
        path:'**',
        redirectTo:'inicio'
    }
];
