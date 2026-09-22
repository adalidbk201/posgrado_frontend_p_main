import { Component, inject, signal, HostListener } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly themeService = inject(ThemeService);

  //Cambiar logo 
  get logoSrc(): string {
    return this.themeService.theme() === 'dark'
      ? '/img/logo-dark.png'
      : '/img/logo.png';
  }


  // Metodo del themeService
  toggleTheme(): void {
    this.themeService.toggle();
  }

  // señal scrol 
  readonly scrolled = signal(false);

  // Si el scroll enpieza a bajar 
  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }


  readonly menuOpen = signal(false)
  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }


}
