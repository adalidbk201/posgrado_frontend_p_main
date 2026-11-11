export interface Comunicado{
    id:string,
    foto:string,
    fecha_expiracion:string,
    estado_comunicado:string,
    estado:string,
    descripcion:string,
    colaciones:[
        {
            id:string,
            fecha_colacion:string,
            turno:string,
            descripcion:string,
        }
    ]
}
export interface ComunicadoResponse {
  id: string;
  foto: File;
  fecha_expiracion: string;
  descripcion: string;
  colaciones: string[];
}