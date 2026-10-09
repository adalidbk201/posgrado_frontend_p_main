import { Mencion } from '../../menciones/models/mencion.interface';

export interface Programa {
  estado: string;
  id: string;
  nombre_programa: string;

  grado: {
    estado: string;
    id: number;
    grado_academico: string;
    jerarquia: number;
  };

  menciones: Mencion[];
}