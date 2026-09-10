import { Component, AfterViewInit  } from '@angular/core';

declare var $: any; // jQuery cargado globalmente vía CDN en index.html
interface FotoGraduado {
  src: string;
  alt: string;
}
@Component({
  selector: 'app-testimonios',
  imports: [],
  templateUrl: './testimonios.html',
  styleUrl: './testimonios.scss',
})
export class Testimonios {
  readonly fotos: FotoGraduado[] = [
    { src: '/img/graduados/foto-1.jpg', alt: 'Graduados Posgrado UPEA - Promoción 1' },
    { src: '/img/graduados/foto-2.jpg', alt: 'Graduados Posgrado UPEA - Promoción 2' },
    { src: '/img/graduados/foto-3.jpg', alt: 'Graduados Posgrado UPEA - Promoción 3' },
    { src: '/img/graduados/foto-4.jpg', alt: 'Graduados Posgrado UPEA - Promoción 4' },
    { src: '/img/graduados/foto-5.jpg', alt: 'Graduados Posgrado UPEA - Promoción 5' },
  ];

  ngAfterViewInit(): void {
    $('#testimoniosCarousel').carousel({
      interval: 5000,
      wrap: true,
      pause: 'hover',
    });
  }
}
