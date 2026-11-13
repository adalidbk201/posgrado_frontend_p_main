export interface UsuarioRequest  {
  nombre_usuario:string,
  contrasena:string,
  correo_electronico:string,
  // codigo_desbloqueo:string,
  // codigo_recuperacion:string,
  // codigo_transaccion:string,
  // codigo_activacion:string,
  // fecha_bloqueo:string,
  url_foto:string,
  persona:string,

}
export interface FotoPerfilRequest {
  foto: File;
}

export interface PasswordPerfil {
  contrasena_actual: string,
  contrasena_nueva: string
}

export interface RecuperarCuentaRequest{
  correo_electronico:string
}

export interface ValidarRecuperarRequest{
  codigo:string
}