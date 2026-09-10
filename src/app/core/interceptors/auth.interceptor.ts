import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');

  const rutasPublicas = [
    '/api/login/',
    '/api/refresh/',
    '/api/csrf/',
  ];

  const esPublica = rutasPublicas.some((ruta) =>
    req.url.includes(ruta),
  );

  console.log('========== AUTH INTERCEPTOR ==========');
  console.log('URL:', req.url);
  console.log('Token existe:', !!token);
  console.log('Es ruta pública:', esPublica);

  if (esPublica || !token) {
    console.log('➡️ Petición enviada sin token');

    return next(req);
  }

  const reqConToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(
    'Authorization:',
    reqConToken.headers.get('Authorization'),
  );

  return next(reqConToken);
};