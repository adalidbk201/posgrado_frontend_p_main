import { Component, HostListener, signal } from '@angular/core';

interface FotoGraduado {
  src: string;
  alt: string;
  titulo: string;
}

@Component({
  selector: 'app-testimonios',
  imports: [],
  templateUrl: './testimonios.html',
  styleUrl: './testimonios.scss',
})
export class Testimonios {
  readonly fotos: FotoGraduado[] = [
    { src: '/img/graduados/foto-1.webp', alt: 'Graduados Posgrado UPEA - Promoción 1', titulo: 'Maestría en Educación Superior' },
    { src: '/img/graduados/foto-2.webp', alt: 'Graduados Posgrado UPEA - Promoción 2', titulo: 'Administración y Gestión Educativa' },
    { src: '/img/graduados/foto-3.webp', alt: 'Graduados Posgrado UPEA - Promoción 3', titulo: 'Colación de Grado 2026' },
    { src: '/img/graduados/foto-4.webp', alt: 'Graduados Posgrado UPEA - Promoción 4', titulo: 'Diplomado en Tecnología Educativa' },
    { src: '/img/graduados/foto-5.webp', alt: 'Graduados Posgrado UPEA - Promoción 5', titulo: 'Maestría en Investigación' },
  ];

  readonly fotoActivaIndex = signal<number | null>(null);

  //  Detectar si es móvil (breakpoint-sm = 576px, ajusta si usas otro)
  readonly isMobile = signal<boolean>(false);

  constructor() {
    this.checkMobile();
  }

  private checkMobile(): void {
    this.isMobile.set(window.innerWidth < 576);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkMobile();
  }

  abrirLightbox(index: number): void {
    //  No abrir en móvil
    if (this.isMobile()) return;
    this.fotoActivaIndex.set(index);
  }

  cerrarLightbox(): void {
    this.fotoActivaIndex.set(null);
  }

  siguienteFoto(): void {
    const actual = this.fotoActivaIndex();
    if (actual === null) return;
    this.fotoActivaIndex.set((actual + 1) % this.fotos.length);
  }

  anteriorFoto(): void {
    const actual = this.fotoActivaIndex();
    if (actual === null) return;
    this.fotoActivaIndex.set((actual - 1 + this.fotos.length) % this.fotos.length);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.fotoActivaIndex() === null) return;
    if (event.key === 'Escape') this.cerrarLightbox();
    if (event.key === 'ArrowRight') this.siguienteFoto();
    if (event.key === 'ArrowLeft') this.anteriorFoto();
  }
}