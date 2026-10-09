export interface PersonaRequest{
    persona:{
        pais_documento:string,
        nro_documento:string,
        nombres:string,
        primer_apellido:string,
        segundo_apellido:string,
        expedido:string,
        genero:string,   
        celular:string,
        observacion:string,
        fecha_nacimiento:string,
        correo_electronico:string,
    },
    id_rol:number,
    fecha_fin:string,
    id_programa:string,
    id_mencion:number,
    
    
    
} 