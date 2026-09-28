export interface Colacion{
    id:string,
    fecha_colacion:string,
    turno:string,
    descripcion:string,
    estado:string,
    sala:{
        id:string,
        nombre_sala:string,
    }
}