export interface SalaRequest  {
  nombre_sala: string;
  niveles:[
    {
      numero_nivel: number | null;
      nombre_nivel: string;
      filas:number | null;
      columnas:number | null;
    }
  ]
}

export interface SalaEditarRequest {
 nombre_sala: string;
}