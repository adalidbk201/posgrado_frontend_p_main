import {
  Component, inject, signal, HostListener,
  AfterViewInit, OnDestroy, NgZone,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements AfterViewInit, OnDestroy {
  readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);

  //  Sección actualmente visible / seleccionada
  readonly activeSection = signal<string>('inicio');

  //  Mapa: id del elemento en el DOM → id lógico del menú
  private readonly sections: Record<string, string> = {
    'inicio': 'inicio',
    'conocenos': 'conocenos',
    'testimonios': 'testimonios',
    'programas': 'programas',
    'ubicacion': 'ubicacion',
  };

  private observer?: IntersectionObserver;

  // =========================
  // TEMA
  // =========================
  toggleTheme(): void {
    this.themeService.toggle();
  }

  // =========================
  // SCROLL (sombra del navbar)
  // =========================
  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  // =========================
  // MENÚ MÓVIL
  // =========================
  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  // =========================
  // ESTADO ACTIVO
  // =========================
  isActive(id: string): boolean {
    return this.activeSection() === id;
  }

  // Feedback inmediato al hacer clic (no esperar al observer)
  onNavClick(id: string): void {
    this.activeSection.set(id);
    //  Si es "inicio", hacer scroll suave al tope
    if (id === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // =========================
  // SCROLL SPY + SYNC URL
  // =========================
  ngAfterViewInit(): void {
    this.syncFromUrl();

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          // La sección con mayor intersección en la "banda central" del viewport
          const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visible.length > 0) {
            const domId = visible[0].target.id;
            const logical = this.sections[domId] ?? domId;
            this.zone.run(() => this.activeSection.set(logical));
          }
        },
        {
          // Banda activa: 40% superior e inferior excluidas → solo el centro manda
          rootMargin: '-40% 0px -55% 0px',
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );

      Object.keys(this.sections).forEach(id => {
        const el = document.getElementById(id);
        if (el) this.observer!.observe(el);
      });
    });
  }

  // Sincronizar con la URL (back/forward, carga directa con #fragmento)
  private syncFromUrl(): void {
    const url = this.router.url; // ej: "/#conocenos" o "/;foo=bar"
    const frag = url.includes('#') ? url.split('#')[1] : '';
    const clean = frag.replace(/^\//, '');
    this.activeSection.set(
      clean && this.sections[clean] ? this.sections[clean] : 'inicio'
    );
  }

  // Re-sincronizar al navegar (botón atrás del navegador, etc.)
  private readonly navSub = this.router.events.subscribe(() => {
    // NavigationEnd llega como cualquier evento; filtramos por tipo interno
    // usando el fragmento actual del router
  });

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.navSub.unsubscribe();
  }
}