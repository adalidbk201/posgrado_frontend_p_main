import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface ItemMenu {
  label: string;
  ruta: string;
  icono: string;
}

interface CategoriaMenu {
  id: string;
  titulo: string;
  items: ItemMenu[];
  collapse: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly menuAbierto = signal(false);
  readonly categorias = signal<CategoriaMenu[]>([
    {
      id: 'administracion',
      titulo: 'Administración',
      items: [
        { label: 'Personas', ruta: '/dashboard/personas', icono: '👤' },
        { label: 'Cuentas', ruta: '/dashboard/usuarios', icono: '👥' },
        { label: 'Roles', ruta: '/dashboard/roles', icono: '' },
        { label: 'Grados académicos', ruta: '/dashboard/grados', icono: '🎓' },
        { label: 'Menciones', ruta: '/dashboard/menciones', icono: '📚' },
        { label: 'Programas', ruta: '/dashboard/programas', icono: '📘' },
      ],
      collapse: '',
    },
    {
      id: 'salas',
      titulo: 'Configuración de Salas',
      items: [
        { label: 'Salas', ruta: '/dashboard/salas', icono: '🏛' },
        { label: 'Niveles', ruta: '/dashboard/niveles', icono: '▤' },
        { label: 'Butacas', ruta: '/dashboard/butacas', icono: '💺' },
      ],
      collapse: '',
    },
    {
      id: 'academica',
      titulo: 'Gestión Académica',
      items: [
        { label: 'Titulados', ruta: '/dashboard/titulados', icono: '📜' },
        { label: 'Colaciones', ruta: '/dashboard/colaciones', icono: '' },
      ],
      collapse: '',
    },
    {
      id: 'evento',
      titulo: 'Gestión del Evento',
      items: [
        { label: 'Asignación de butacas', ruta: '/dashboard/asignaciones', icono: '▦' },
        { label: 'Asistencia', ruta: '/dashboard/asistencias', icono: '✓' },
        { label: 'Comunicados', ruta: '/dashboard/comunicados', icono: '' },
      ],
      collapse: '',
    },
    {
      id: 'seguridad',
      titulo: 'Seguridad',
      items: [
        { label: 'Módulos', ruta: '/dashboard/modulos', icono: '🧩' },
      ],
      collapse: '',
    },
  ]);

  abrirCerrarMenu(): void {
    this.menuAbierto.update((estado) => !estado);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  toggleCategoria(id: string): void {
    this.categorias.update(categorias => 
      categorias.map(cat => ({
        ...cat,
        collapse: cat.id === id 
          ? (cat.collapse === 'show' ? '' : 'show')
          : cat.collapse
      }))
    );
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}