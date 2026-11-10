export interface ComunicadoRequest{
    foto: File;
    fecha_expiracion:string,
    descripcion:string,
    colaciones:string[],
}

export interface ComunicadoActualizarRequest {
  foto?: File;
  fecha_expiracion: string;
  descripcion: string;
  colaciones: string[];
}