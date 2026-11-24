import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-banner',
  imports: [RouterLink],
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
})
export class Banner implements AfterViewInit, OnDestroy {

  ngAfterViewInit(): void {
    // Accesibilidad: si el usuario pide menos movimiento, sin autoplay
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    $('#heroCarousel').carousel(
      reduceMotion
        ? { interval: false, ride: false, wrap: true }
        : { interval: 5000, wrap: true, pause: false }
    );
  }

  ngOnDestroy(): void {
    // Evita memoria huérfana del plugin de jQuery al salir del componente
    $('#heroCarousel').carousel('dispose');
  }
}