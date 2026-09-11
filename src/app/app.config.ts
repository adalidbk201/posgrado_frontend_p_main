import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

import { provideHttpClient, withInterceptors, } from'@angular/common/http'

import { authInterceptor } from './core/interceptors/auth.interceptor'; 




export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,

      // Configuración para navegar por fragmentos en la misma pagina
      withInMemoryScrolling({
        // Activa el comportamiento
        anchorScrolling:'enabled', 
        // Devuelve arriba al cambiar de pagina
        scrollPositionRestoration:'enabled'
      })
    ),

    //realizar peticiones http
    provideHttpClient(withInterceptors([
        authInterceptor,
      ]))
  ]
};
