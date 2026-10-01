import { Component  } from '@angular/core';

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

   
}
