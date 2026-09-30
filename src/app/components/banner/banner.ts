import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-banner',
  imports: [],
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
})
export class Banner {
     /**
   * Permite destruir automáticamente
   * la suscripción del intervalo.
   */
  private readonly destroyRef = inject(DestroyRef);


  /**
   * Imágenes del banner.
   */
  readonly imagenes = [
    '/img/fondo1.png',
    '/img/fondo2.png',
    '/img/fondo3.png',
  ];


  /**
   * Imagen que actualmente está visible
   * en la primera capa.
   */
  readonly imagenCapa1 = signal(this.imagenes[0]);


  /**
   * Imagen que actualmente está visible
   * en la segunda capa.
   */
  readonly imagenCapa2 = signal(this.imagenes[1]);


  /**
   * Capa que actualmente está visible.
   *
   * 0 = capa 1
   * 1 = capa 2
   */
  readonly capaActiva = signal(0);


  /**
   * Índice de la imagen actualmente visible.
   */
  private indiceActual = 0;


  constructor() {

    /**
     * Precargamos todas las imágenes.
     */
    this.precargarImagenes();


    /**
     * Cambiamos de imagen cada 7 segundos.
     */
    interval(7000)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.cambiarImagen();
      });
  }


  /**
   * Cambia suavemente a la siguiente imagen.
   */
  private cambiarImagen(): void {

    /**
     * Calculamos la siguiente imagen.
     */
    const siguienteIndice =
      (this.indiceActual + 1) % this.imagenes.length;


    /**
     * Si actualmente está visible la capa 1,
     * preparamos la siguiente imagen en la capa 2.
     */
    if (this.capaActiva() === 0) {

      this.imagenCapa2.set(
        this.imagenes[siguienteIndice]
      );

      /**
       * Activamos la capa 2.
       */
      this.capaActiva.set(1);

    } else {

      /**
       * Si actualmente está visible la capa 2,
       * preparamos la siguiente imagen en la capa 1.
       */
      this.imagenCapa1.set(
        this.imagenes[siguienteIndice]
      );

      /**
       * Activamos la capa 1.
       */
      this.capaActiva.set(0);
    }


    /**
     * Guardamos el índice actual.
     */
    this.indiceActual = siguienteIndice;
  }


  /**
   * Precarga todas las imágenes.
   *
   * Esto evita que aparezca un espacio vacío
   * mientras el navegador descarga una imagen.
   */
  private precargarImagenes(): void {

    for (const imagen of this.imagenes) {

      const img = new Image();

      img.src = imagen;
    }
  }
}
