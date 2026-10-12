export interface Titulado{
    id:string,
    estado:string,
    transaccion:string,
    fecha_creacion:string,
    fecha_modificacion:string | null,
    fecha_titulacion:string,
    grado_posgraduante:string,
    mencion:string,
    serie:string,
    nro_titulo:string,
    usuario_creacion:string,
    usuario_modificacion:string | null,
    persona:string,
    programa:string,

};

export interface PersonaTitulado{
    id: string,
    fecha_titulacion: null,
    grado_posgraduante: "",
    serie: string,
    nro_titulo: string,
    mencion: {
    id: number,
    mencion: string
    },
    programa: {
    id: string,
    nombre_programa: string
    },
    grado: {
    id: number,
    grado_academico: string,
    }
}