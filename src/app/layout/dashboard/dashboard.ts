import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UsuariosService } from '../../features/usuarios/services/usuarios.service';
import { PerfilResponse } from '../../features/usuarios/models/usuario.interface';
import { environment } from '../../../environment/environment';

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
export class Dashboard implements OnInit {
  ngOnInit(): void {
    this.cargarPerfil();
  }

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // verificar qe es administrador
  readonly esAdministrador = computed(
        () => this.authService.roles().includes('ADMINISTRADOR')
    );
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
    // {
    //   id: 'seguridad',
    //   titulo: 'Seguridad',
    //   items: [
    //     { label: 'Módulos', ruta: '/dashboard/modulos', icono: '🧩' },
    //   ],
    //   collapse: '',
    // },
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


  /** DATOS DEL PERFIL QUE INICIO SESSION */
  private readonly UsuariosService = inject(UsuariosService);

  readonly perfil = signal<PerfilResponse | null>(null);

 readonly fotoPerfilUrl = computed(() => {
  const filename = this.perfil()?.url_foto;

  const url = filename
    ? `${environment.API}/uploads/profile-photos/${filename}`
    : 'img/user.png';

  console.log('URL de fotografía:', url);

  return url;
});

  /** CARGAR PERFIL */
  cargarPerfil(): void {
    this.UsuariosService.obtenerPerfil().subscribe({
      next: (respuesta) => {
        console.log('Respuesta completa del perfil:', respuesta);
        console.log('Datos del perfil:', respuesta.Data);

        this.perfil.set(respuesta.Data);
      },
      error: (error) => {
        console.error('Error al obtener el perfil:', error);
      },
    });
  }

}