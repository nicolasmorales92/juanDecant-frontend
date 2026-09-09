import { Variantes } from "./variantes";

export interface CrearPoducto {
    nombre: string
    marca: string
    genero: string
    descripcion: string;
    imagenes?: string[]
    variantes: Variantes[]
}


