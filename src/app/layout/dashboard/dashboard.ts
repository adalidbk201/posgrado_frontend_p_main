import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';  

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

  
}