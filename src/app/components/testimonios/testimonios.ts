import { Component, HostListener, signal  } from '@angular/core';

declare var $: any; // jQuery cargado globalmente vía CDN en index.html
interface FotoGraduado {
  src: string;
  alt: string;
  titulo: string; // texto que aparece sobre la imagen
}
@Component({
  selector: 'app-testimonios',
  imports: [],
  templateUrl: './testimonios.html',
  styleUrl: './testimonios.scss',
})
export class Testimonios {
 readonly fotos: FotoGraduado[] = [
    {
      src: '/img/graduados/foto-1.jpg',
      alt: 'Graduados Posgrado UPEA - Promoción 1',
      titulo: 'Maestría en Educación Superior',
    },
    {
      src: '/img/graduados/foto-2.jpg',
      alt: 'Graduados Posgrado UPEA - Promoción 2',
      titulo: 'Administración y Gestión Educativa',
    },
    {
      src: '/img/graduados/foto-3.jpg',
      alt: 'Graduados Posgrado UPEA - Promoción 3',
      titulo: 'Colación de Grado 2026',
    },
    {
      src: '/img/graduados/foto-4.jpg',
      alt: 'Graduados Posgrado UPEA - Promoción 4',
      titulo: 'Diplomado en Tecnología Educativa',
    },
    {
      src: '/img/graduados/foto-5.jpg',
      alt: 'Graduados Posgrado UPEA - Promoción 5',
      titulo: 'Maestría en Investigación',
    },
  ];

   // =========================
  // LIGHTBOX
  // =========================

  // índice de la foto abierta en grande; null = lightbox cerrado
  readonly fotoActivaIndex = signal<number | null>(null);

  abrirLightbox(index: number): void {
    this.fotoActivaIndex.set(index);
  }

  cerrarLightbox(): void {
    this.fotoActivaIndex.set(null);
  }

  siguienteFoto(): void {
    const actual = this.fotoActivaIndex();
    if (actual === null) return;
    // módulo (%) hace que, al llegar a la última, vuelva a la primera
    this.fotoActivaIndex.set((actual + 1) % this.fotos.length);
  }

  anteriorFoto(): void {
    const actual = this.fotoActivaIndex();
    if (actual === null) return;
    // + length antes del % evita resultados negativos al ir hacia atrás desde la foto 0
    this.fotoActivaIndex.set((actual - 1 + this.fotos.length) % this.fotos.length);
  }

  // navegación por teclado: funciona en cualquier parte de la página
  // mientras el lightbox esté abierto, sin necesitar foco en un elemento específico
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.fotoActivaIndex() === null) return;

    if (event.key === 'Escape') this.cerrarLightbox();
    if (event.key === 'ArrowRight') this.siguienteFoto();
    if (event.key === 'ArrowLeft') this.anteriorFoto();
  }

   
}
