export interface Comunicado{
    id:string,
    foto:string,
    fecha_expiracion:string,
    estado_comunicado:string,
    descripcion:string,
    colaciones:{
        id:string,
        fecha_colacion:string,
        turno:string,
    }
}