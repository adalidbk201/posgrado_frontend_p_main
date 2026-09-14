import { Component, signal, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
// importar animacion aos
import AOS from 'aos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  protected readonly title = signal('pogrado_frontend_p-main');

  // AOS
  private router = inject(Router);
  ngOnInit(): void {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
       once: false,     // ← antes: true. Ahora se re-anima cada vez que el elemento entra al viewport
       mirror: true,    // ← nuevo: también anima al pasar el elemento subiendo el scroll
      offset: 80,       // px antes de entrar al viewport para disparar
    });

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => AOS.refreshHard(), 150); // deja que el DOM del nuevo componente se monte
      });
  }
}
