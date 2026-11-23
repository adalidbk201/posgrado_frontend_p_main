export interface Asignacion{
    id:string,
    colacion:{
        id:string,
        fecha_colacion:string,
        turno:string,
        descripcion:string,
        estado:string,
        sala:{
            id:string,
            nombre_sala:string,
        }
    },
    titulado:string,
    butaca: {
        id: string,
        fila: number | null,
        columna: number | null,
        codigo_butaca: string,
        estado_butaca: string,
        nivel: {
            id: string,
            numero_nivel: number,
            nombre_nivel: string,
            filas: number,
            columnas: number,
        },
    },
    persona:{
        id:string,
        nombres:string,
        primer_apellido:string,
        segundo_apellido:string,
        nro_documento:string,
        celular:string,
    },
    programa:{
        id:string,
        nombre_programa:string,
        grado:{
            id:number,
            grado_academico:string,
        }
    }
}