// definir y tipar los datos recibidos por el backend
import { PersonaTitulado } from "../../titulados/models/titulado.interface";
export interface Persona{
    usuario_id:string,
    usuario:string,
    correo_electronico:string,
    estado:string,
    fecha_creacion:string,
    roles:string,
    id:string,
    nombres:string,
    primer_apellido:string,
    segundo_apellido:string,
    nro_documento:string,
    genero:string,
    expedido:string,
    celular:string,
    titulado:PersonaTitulado,

} 