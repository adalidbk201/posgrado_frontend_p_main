export interface Sala{  
  estado: string;
  id: string;
  nombre_sala: string;
  niveles:[
    {
    id: string;
    numero_nivel: number;
    nombre_nivel: string;
    filas:number;
    columnas:number;
  }
]
 
}

