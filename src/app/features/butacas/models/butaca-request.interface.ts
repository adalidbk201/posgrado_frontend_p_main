export interface ButacaRequest{
    fila:number | null,
    columna:number | null,
    codigo_butaca:string,
}


export interface CrearButacaRequest {
  id_nivel: string;
  datos: ButacaRequest;
}