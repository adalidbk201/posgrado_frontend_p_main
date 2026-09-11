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
            {
                path:'asistencias',
                loadComponent:()=>import('./features/asistencias/pages/lista-asistencias/lista-asistencias').then((m)=>m.ListaAsistencias)
            },

            
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
            

            {
                path:'programas',
                loadComponent:()=>import('./features/programas/pages/lista-programas/lista-programas').then((m)=>m.ListaProgramas)
            },
            {
                path:'titulados',
                loadComponent:()=>import('./features/titulados/pages/lista-titulados/lista-titulados').then((m)=>m.ListaTitulados)
            },


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


            {
                path:'asignaciones',
                loadComponent:()=>import('./features/asignaciones/pages/lista-asignaciones/lista-asignaciones').then((m)=>m.ListaAsignaciones),
            },



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



            {
                path:'**',
                redirectTo:'asistencias'
            }
        ]
    },
 
    {
        path:'**',
        redirectTo:'inicio'
    }
];
