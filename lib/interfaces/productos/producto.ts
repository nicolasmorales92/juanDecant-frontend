import { Variantes } from "./variantes";

export interface Productos {
    id: string,
    nombre: string,
    marca: string,
    genero: string,
    descripcion: string;
    imagenes: string[],
    variantes: Variantes[]
}