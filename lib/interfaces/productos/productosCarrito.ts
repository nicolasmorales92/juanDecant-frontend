import { Productos } from "./producto";

export interface CarritoItems extends Productos {
  cartItemId: string;        
  varianteId: string;
  cantidad: number;
  precioSeleccionado: number;
}