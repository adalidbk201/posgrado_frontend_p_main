import { Component, inject } from '@angular/core';
import { ToastService, type ToastMensaje } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-global',
  standalone: true,
  templateUrl: './toast-global.html',
  styleUrl: './toast-global.scss',
})
export class ToastGlobal {
  private toastService = inject(ToastService);

  readonly toasts = this.toastService.toasts;

  cerrar(id: number): void {
    this.toastService.eliminar(id);
  }

  // 👇 NUEVOS MÉTODOS
  pausarToast(id: number): void {
    this.toastService.pausar(id);
  }

  reanudarToast(id: number): void {
    this.toastService.reanudar(id);
  }

  iconoSvg(tipo: ToastMensaje['tipo']): string {
    switch (tipo) {
      case 'exito':   return 'M20 6 9 17 4 12';
      case 'error':   return 'M18 6 6 18 M6 6 18 18';
      case 'warning': return 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01';
      case 'info':    return 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 16v-4 M12 8h.01';
    }
  }

  titulo(tipo: ToastMensaje['tipo']): string {
    const titulos: Record<ToastMensaje['tipo'], string> = {
      exito: 'Éxito',
      error: 'Error',
      warning: 'Atención',
      info: 'Información',
    };
    return titulos[tipo];
  }
}