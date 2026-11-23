export interface Butaca{
    id:string,
    fila:number | null,
    columna:number | null,
    codigo_butaca:string,
    estado_butaca:string,
    nivel:Nivel,
}

export interface Nivel {
  id: string;
  numero_nivel: number;
  nombre_nivel: string;
  filas: number;
  columnas: number;
}