export interface Programa{
    id:string,
    estado:string,
    nombre_programa:string,
    grado:{
        id:number,
        grado_academico:string,
        jerarquia:number,
    }
    menciones:{
        id:number,
        mencion:string,
    }
};