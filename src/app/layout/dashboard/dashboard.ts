import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';  
/** INTERFACE PARA EL MENU */

interface ItemMenu {
  label: string;
  ruta: string;
  icono: string;
   
}

interface CategoriaMenu {
  id: string;
  titulo: string;
  items: ItemMenu[];
  collapse:string;
}


@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})



export class Dashboard {
   // Inyectar Router
  private readonly router = inject(Router);

  // Controla el menú en dispositivos móviles
  readonly menuAbierto = signal(false);

  abrirCerrarMenu(): void {
    this.menuAbierto.update((estado) => !estado);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  /** Cierra la sesión del usuario */
  // Inyectar AuthService
  private readonly authService = inject(AuthService);

  cerrarSesion(): void {
    // Eliminar token mediante el servicio
    this.authService.logout();

    // Redirigir al login replaceUrl: true ayuda con el historial, pero el Guard es la protección real.
    this.router.navigate(['/login'],{replaceUrl: true,});
  }


  /** CONFIGURACION DEL MENU  */
  // dentro de la clase:
  readonly categorias: CategoriaMenu[] = [
    {
      id: 'administracion',
      titulo: 'Administración',
      items: [
        { label: 'Personas', ruta: '/dashboard/personas', icono: '👤' },
        { label: 'Cuentas', ruta: '/dashboard/usuarios', icono: '👥' },
        { label: 'Roles', ruta: '/dashboard/roles', icono: '🔐' },
        { label: 'Grados académicos', ruta: '/dashboard/grados', icono: '🎓' },
        { label: 'Menciones', ruta: '/dashboard/menciones', icono: '📚' },
        { label: 'Programas', ruta: '/dashboard/programas', icono: '📘' },
      ],
      collapse:'show',
    },
    {
      id: 'salas',
      titulo: 'Configuración de Salas',
      items: [
        { label: 'Salas', ruta: '/dashboard/salas', icono: '🏛' },
        { label: 'Niveles', ruta: '/dashboard/niveles', icono: '▤' },
        { label: 'Butacas', ruta: '/dashboard/butacas', icono: '💺' },
      ],
      collapse:'',
    },
    {
      id: 'academica',
      titulo: 'Gestión Académica',
      items: [
        { label: 'Titulados', ruta: '/dashboard/titulados', icono: '📜' },
        { label: 'Colaciones', ruta: '/dashboard/colaciones', icono: '🎓' },
      ],
      collapse:'',
    },
    {
      id: 'evento',
      titulo: 'Gestión del Evento',
      items: [
        { label: 'Asignación de butacas', ruta: '/dashboard/asignaciones', icono: '▦' },
        { label: 'Asistencia', ruta: '/dashboard/asistencias', icono: '✓' },
        { label: 'Comunicados', ruta: '/dashboard/comunicados', icono: '📢' },
      ],
      collapse:'',
    },
    {
      id: 'seguridad',
      titulo: 'Seguridad',
      items: [
        { label: 'Módulos', ruta: '/dashboard/modulos', icono: '🧩' },
      ],
      collapse:'',
    },
  ];
  
}