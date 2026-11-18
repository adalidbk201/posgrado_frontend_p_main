import { Injectable, signal } from '@angular/core';

export type ToastTipo = 'exito' | 'error' | 'info' | 'warning';

export interface ToastMensaje {
  id: number;
  tipo: ToastTipo;
  mensaje: string;
  tiempoRestante: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  /** Lista de toasts activos (soporta múltiples simultáneos) */
  readonly toasts = signal<ToastMensaje[]>([]);

   private contador = 0;
   private timeouts = new Map<number, any>(); //  Mapa de timeouts por ID

  mostrar(tipo: ToastTipo, mensaje: string, duracion = 4000): void {
    const id = ++this.contador;
    const toast: ToastMensaje = { id, tipo, mensaje, tiempoRestante: duracion };

    this.toasts.update(lista => [...lista, toast]);
    this.iniciarTemporizador(id, duracion);
  }

  private iniciarTemporizador(id: number, duracion: number): void {
    const timeout = setTimeout(() => this.eliminar(id), duracion);
    this.timeouts.set(id, timeout);
  }

  eliminar(id: number): void {
    this.toasts.update(lista => lista.filter(t => t.id !== id));
  }

   //  NUEVOS MÉTODOS PARA PAUSAR/REANUDAR
  pausar(id: number): void {
    const timeout = this.timeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(id);
    }

    // Pausar la animación CSS de la barra de progreso
    const barra = document.querySelector(`[data-toast-id="${id}"] .toast-card__progreso-barra`) as HTMLElement;
    if (barra) {
      const computed = window.getComputedStyle(barra);
      const transform = computed.getPropertyValue('transform');
      barra.style.transform = transform;
      barra.style.animationPlayState = 'paused';
    }

    // Calcular tiempo restante aproximado (simple: asumimos que queda la mitad si no hay forma precisa)
    // Para una versión más exacta, podrías guardar el timestamp de inicio
  }

  reanudar(id: number): void {
    const toast = this.toasts().find(t => t.id === id);
    if (!toast) return;

    // Reanudar animación CSS
    const barra = document.querySelector(`[data-toast-id="${id}"] .toast-card__progreso-barra`) as HTMLElement;
    if (barra) {
      barra.style.animationPlayState = 'running';
    }

    // Reiniciar temporizador con tiempo restante (aproximado)
    this.iniciarTemporizador(id, 2000); //  Tiempo fijo de 2s al reanudar (simple y efectivo)
  }

  private limpiarTimeout(id: number): void {
    const timeout = this.timeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(id);
    }
  }

  // Atajos
  exito(mensaje: string): void   { this.mostrar('exito', mensaje); }
  error(mensaje: string): void   { this.mostrar('error', mensaje); }
  info(mensaje: string): void    { this.mostrar('info', mensaje); }
  warning(mensaje: string): void { this.mostrar('warning', mensaje); }
}