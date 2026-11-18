import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidarRecuperarRequest } from '../../models/usuario.request.interface';
import { ValidarRecuperarForm } from '../../components/validar-recuperar-form/validar-recuperar-form';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-validar-recuperacion',
  imports: [ValidarRecuperarForm],
  templateUrl: './validar-recuperacion.html',
  styleUrl: './validar-recuperacion.scss',
})
export class ValidarRecuperacion {
  /** inyectar toas para notificaiones */
   private toast = inject(ToastService);
    // injectar salasService
  private readonly usuariosService = inject(UsuariosService);
    // inyectar ActivatedRoute
  private readonly route = inject(ActivatedRoute);
 
  // injectar router
  private readonly router = inject(Router);
 
  
  // metodo validarRecuperacion
  validarRecuperacion(datos: ValidarRecuperarRequest): void {

    // llamamos al metodo validarRecuperacionCuenta: usamos .susbribe para recibir la resopuesta http Post
    this.usuariosService.validarRecuperacionCuenta(datos).subscribe({
      next: () => {
        console.log('Se Recupero la Cuenta');
        //  1. MOSTRAR TOAST DE ÉXITO
        this.toast.exito('Se Recupero la Cuenta.');
        // Volver al listado
        this.router.navigate(['/dashboard/inicio']);
      },

      error: (err) => {
        console.error('Fallo al recuperar la cuenta:', err);
        // Extrae el mensaje del backend si existe, sino usa uno por defecto
            const msg = err?.error?.Errores.codigo
                    || err?.error?.message 
                    || err?.message 
                    || 'Fallo al recuperar la cuenta:';
            
            this.toast.error(msg);
      },
    });
  }

}
