import { Component, inject, input, output, signal } from '@angular/core';
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

  /** El padre puede pasar el estado de guardado para bloquear/deshabilitar el botón. */
  readonly guardando = input<boolean>(false);

  readonly guardar = output<FotoPerfilRequest>();

  // ---------- Estado local ----------
  readonly fotoSeleccionada = signal<File | null>(null);
  readonly nombreFoto = signal<string>('');
  readonly previewUrl = signal<string>('');
  readonly mensajeError = signal<string>('');
  readonly esArrastrando = signal<boolean>(false);

  private readonly FORMATOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly TAMANO_MAX = 5 * 1024 * 1024; // 5 MB

  // ---------- Selección de archivo ----------
  seleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    this.procesarArchivo(archivo);
  }

  // ---------- Drag & Drop ----------
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.esArrastrando.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.esArrastrando.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.esArrastrando.set(false);

    const archivo = event.dataTransfer?.files?.[0];
    if (archivo) this.procesarArchivo(archivo);
  }

  // ---------- Validación + preview ----------
  private procesarArchivo(archivo: File): void {
    this.mensajeError.set('');

    if (!this.FORMATOS_PERMITIDOS.includes(archivo.type)) {
      this.fotoSeleccionada.set(null);
      this.nombreFoto.set('');
      this.previewUrl.set('');
      this.mensajeError.set('Solo se permiten imágenes JPG, PNG y WebP.');
      return;
    }

    if (archivo.size > this.TAMANO_MAX) {
      this.fotoSeleccionada.set(null);
      this.nombreFoto.set('');
      this.previewUrl.set('');
      this.mensajeError.set('La imagen no debe superar los 5 MB.');
      return;
    }

    this.fotoSeleccionada.set(archivo);
    this.nombreFoto.set(archivo.name);

    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(archivo);
  }

  limpiarFoto(): void {
    this.fotoSeleccionada.set(null);
    this.nombreFoto.set('');
    this.previewUrl.set('');
    this.mensajeError.set('');
  }

  // ---------- Acciones ----------
  cancelar(): void {
    this.limpiarFoto();
    this.router.navigate(['/dashboard/inicio']);
  }

  enviarFormulario(): void {
    const foto = this.fotoSeleccionada();

    if (!foto) {
      this.mensajeError.set('Debe seleccionar una fotografía.');
      return;
    }

    const datos: FotoPerfilRequest = { foto };
    this.guardar.emit(datos);
  }
}