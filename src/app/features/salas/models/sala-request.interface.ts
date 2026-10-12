export interface NivelSalaRequest {
  numero_nivel: number;
  nombre_nivel: string;
  filas: number;
  columnas: number;
}

export interface SalaRequest {
  nombre_sala: string;
  niveles: NivelSalaRequest[];
}

export interface SalaEditarRequest {
 nombre_sala: string;
}