export interface Usuario{    
  id: string,
  nombre_usuario: string,
  correo_electronico:string,
  url_foto:string,
  persona:string,
  fecha_creacion:string,
  fecha_modificacion:string | null,
}

export interface PerfilResponse {
   
    id: string;
    nombre_usuario: string;
    url_foto: string | null;
    fecha_creacion: string;
    fecha_modificacion: string;
    roles: [
      {
        idRol: number | null;
        rol:string;
        nombre: string;
        descripcion: string;
      }
    ];
    
  
}


export interface PerfilPersonalResponse {
  nombre_usuario: string,
    correo_electronico: string,
    url_foto: null,
    persona: {
      id: string,
      nombres: string,
      primer_apellido: string,
      segundo_apellido: string,
      nro_documento: string,
      genero: string,
      expedido: string,
      fecha_nacimiento: string,
      observacion: string,
      celular: string,
      titulado: {
        id: string,
        fecha_titulacion: string,
        grado_posgraduante: string,
        serie: string,
        nro_titulo: string,
        asignaciones: [
          {
            id: string,
            colacion: {
              id:string,
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
                  id: number | null,
                  grado_academico: string,
                  jerarquia: number | null
                },
                menciones: [
                  {
                    id: number | null,
                    mencion: string
                  }
                ]
              }
            },
            butaca: {
              id: string,
              fila: number| null,
              columna: number | null,
              codigo_butaca: string,
              estado_butaca: string,
              nivel: {
                id: string,
                numero_nivel: number |null,
                nombre_nivel: string,
                filas: number | null,
                columnas: number | null
              }
            },
            asistencias: [
              {
                id: string,
                fecha_registro: string,
                asistencia: string,
                observacion: string
              }
            ]
          },
          
        ]
      }
    },
    id: string,
    fecha_creacion: string,
    fecha_modificacion: string,
    roles: [
      {
        idRol: number | null,
        rol: string,
        nombre: string,
        descripcion: string
      }
    ]
  
}