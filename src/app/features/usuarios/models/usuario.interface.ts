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