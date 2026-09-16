import { Component, inject } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { Router } from '@angular/router';
import { RolRequest } from '../../models/rol-request.interface';
import { RolForm } from '../../components/rol-form/rol-form';
@Component({
  selector: 'app-crear-rol',
  imports: [RolForm],
  templateUrl: './crear-rol.html',
  styleUrl: './crear-rol.scss',
})
export class CrearRol {
  // inyectar rolesService
  private readonly rolesService= inject(RolesService)

  // inyectar router
  private readonly router=inject(Router)

  // metodo crearRol
    crearRol(datos: RolRequest): void {
  
      // llamamos al metodo crearRol: usamos .susbribe para recibir la resopuesta http Post
      this.rolesService.crearRol(datos).subscribe({
        next: () => {
          console.log('Rol creado correctamente');
  
          // Volver al listado
          this.router.navigate(['/dashboard/roles']);
        },
  
        error: (error) => {
          console.error('Error al crear el rol:', error);
        },
      });
    }


}
