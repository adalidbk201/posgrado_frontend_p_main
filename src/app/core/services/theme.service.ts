import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

// Definimos un tipo TypeScript llamado Theme.
// Solamente puede tener uno de estos dos valores:
// 'light' → tema claro
// 'dark'  → tema oscuro
type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Inyectamos DOCUMENT. Nos permite acceder al documento HTML.
  private readonly document = inject(DOCUMENT);

  // Inyectamos PLATFORM_ID.
  // Angular utiliza esto para saber si el código se está ejecutando
  // en el navegador o en otro entorno, por ejemplo SSR.
  private readonly platformId = inject(PLATFORM_ID);

  // Creamos un signal que almacena el tema actual.Inicialmente  será 'light'.
  readonly theme = signal<Theme>('light');

  // El constructor se ejecuta cuando Angular crea el servicio.
  constructor() {
    this.loadTheme();
  }

  // Cambia entre tema claro y tema oscuro.
  toggle(): void {
    const newTheme: Theme =
      this.theme() === 'light'
        ? 'dark'
        : 'light';

    // Aplicamos el nuevo tema.
    this.setTheme(newTheme);
  }

  // Establece un tema específico.
  setTheme(theme: Theme): void {

    // Actualizamos el signal con el nuevo tema.
    this.theme.set(theme);

    // Comprobamos si estamos ejecutando la aplicación
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Accedemos al elemento <html> del documento.
    // Después agregamos un atributo:
    // data-theme="light"
    // o:
    // data-theme="dark"
    this.document.documentElement.setAttribute(
      'data-theme',
      theme
    );

    // Guardamos el tema en localStorage.
    localStorage.setItem('theme', theme);
  }

  // Método privado que carga el tema guardado.
  private loadTheme(): void {

    // Verificamos nuevamente que estamos en el navegador.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Intentamos recuperar el tema guardado en localStorage.
    const savedTheme =localStorage.getItem('theme') as Theme | null;

    // Comprobamos que el valor guardado realmente sea
    // uno de nuestros temas permitidos.
    if (savedTheme === 'light' || savedTheme === 'dark') {

      // Si encontramos un tema válido, lo aplicamos.
      this.setTheme(savedTheme);
      return;
    }

    // Si el usuario nunca ha seleccionado un tema,
    // consultamos la preferencia del sistema operativo
    // o del navegador.
    //
    // window.matchMedia() permite consultar una media query CSS.
    //
    // '(prefers-color-scheme: dark)'
    //
    // pregunta:
    //
    // "¿El usuario tiene configurado el sistema
    // para utilizar modo oscuro?"
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

     // Aplicamos el tema según la preferencia del sistema.
    this.setTheme(
      prefersDark ? 'dark' : 'light'
    );
  }
}