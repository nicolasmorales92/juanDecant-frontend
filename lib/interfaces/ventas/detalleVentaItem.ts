import { Productos } from "../productos/producto"

export interface DetalleVentaItem {
  id: string
  cantidad: number
  precio: number
  producto: Productos
}
