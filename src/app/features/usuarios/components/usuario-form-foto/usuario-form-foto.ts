import { Component, inject, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FotoPerfilRequest } from '../../models/usuario.request.interface';

@Component({
  selector: 'app-usuario-form-foto',
  imports: [],
  templateUrl: './usuario-form-foto.html',
  styleUrl: './usuario-form-foto.scss',
})
export class UsuarioFormFoto {

  private readonly router = inject(Router);

  readonly guardar = output<FotoPerfilRequest>();

  // Archivo seleccionado
  readonly fotoSeleccionada = signal<File | null>(null);

  // Nombre del archivo
  readonly nombreFoto = signal<string>('');

  seleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) return;

    const formatosPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!formatosPermitidos.includes(archivo.type)) {
      alert('Solo se permiten imágenes JPG, PNG y WebP.');
      input.value = '';
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5 MB.');
      input.value = '';
      return;
    }

    this.fotoSeleccionada.set(archivo);
    this.nombreFoto.set(archivo.name);
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/inicio']);
  }

  enviarFormulario(): void {

    const foto = this.fotoSeleccionada();

    if (!foto) {
      alert('Debe seleccionar una fotografía.');
      return;
    }

    const datos: FotoPerfilRequest = {
      foto: foto,
    };

    this.guardar.emit(datos);
  }
}