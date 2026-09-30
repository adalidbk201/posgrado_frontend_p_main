import { Component, AfterViewInit  } from '@angular/core';
import { RouterLink } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {

   ngAfterViewInit(): void {
    $('#heroCarousel').carousel({
      interval: 4000,  // ms entre cada cambio de imagen
      wrap: true,       // vuelve a la primera al llegar a la última
      pause: false,     // no se detiene al pasar el mouse por encima (es decorativo)
    });
  }
 
}
