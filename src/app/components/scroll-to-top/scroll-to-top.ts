import { Component, HostListener, signal } from '@angular/core'
@Component({
  selector: 'app-scroll-to-top',
  imports: [],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.scss',
})
export class ScrollToTop {
  // se hace visible solo después de bajar un poco la página
  readonly visible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > 400);
  }

  irArriba(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
