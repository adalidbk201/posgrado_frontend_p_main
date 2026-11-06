export interface Asistencia{
    id: string,
    asistencia:string,
    asignacion_butaca: {
        id: string,
         colacion: {
          id: string,
          fecha_colacion: string,
          turno: string,
          descripcion: string,
          estado: string,
          sala: {
            id: string,
            nombre_sala: string
          },
          programa: {
            estado: string,
            id: string,
            nombre_programa: string,
            grado: {
              estado: string,
              id: 0,
              grado_academico: string,
              jerarquia: 0
            },
            menciones: string
          }
        },
        butaca: {
            id: string,
            fila: number | null,
            columna: number | null,
            codigo_butaca: string,
            estado_butaca: string,
            nivel: string,
        },
        titulado: {
            id: string,
            grado_posgraduante: string,
            persona: {
                id:string,
                nombres: string,
                primer_apellido: string,
                segundo_apellido: string,
                nro_documento: string,
                celular: string
            },
            programa: {
                id: string,
                nombre_programa: string,
                grado: {
                    id: number | null,
                    grado_academico: string,
                }
            }
        }
    }
}