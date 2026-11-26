import {
  Component, NgZone, OnInit, OnDestroy,
  inject, signal, computed,
} from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  imports: [],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.scss',
})
export class ScrollToTop implements OnInit, OnDestroy {
  readonly visible = signal(false);
  readonly progress = signal(0);

  private readonly CIRCUMFERENCE = 2 * Math.PI * 17; // ≈ 106.81

  readonly progressOffset = computed(
    () => this.CIRCUMFERENCE * (1 - this.progress())
  );

  private readonly zone = inject(NgZone);
  private handler?: () => void;

  //  Umbral responsivo: 50% del viewport, con piso de 250px
  private get threshold(): number {
    return Math.max(250, window.innerHeight * 0.5);
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.handler = () => {
        const scrollY = window.scrollY;

        //  Ahora el umbral se recalcula según la altura real del viewport
        const show = scrollY > this.threshold;
        if (show !== this.visible()) {
          this.zone.run(() => this.visible.set(show));
        }

        // Progreso (0 → 1)
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(scrollY / max, 1) : 0;
        if (Math.abs(ratio - this.progress()) > 0.005) {
          this.zone.run(() => this.progress.set(ratio));
        }
      };

      window.addEventListener('scroll', this.handler, { passive: true });
      this.handler();
    });
  }

  ngOnDestroy(): void {
    if (this.handler) window.removeEventListener('scroll', this.handler);
  }

  irArriba(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}