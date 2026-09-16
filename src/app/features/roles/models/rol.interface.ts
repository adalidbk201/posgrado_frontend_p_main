export interface Rol{
    id:number,
    estado:string,
    transaccion:string,
    fecha_creacion:string,
    fecha_modificacion:string | null,
    rol:string,
    nombre:string,
    descripcion:string,
    usuario_creacion:string,
    usuario_modificacion:string | null,
}