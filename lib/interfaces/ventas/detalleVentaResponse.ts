import { DetalleVentaItem } from "./detalleVentaItem"

export interface DetalleVentaResponse {
  id: string
  fecha: string
  total: number
  metodoPago: string
  estado: string
  detalle_venta: DetalleVentaItem[]
  nombreClienteCasual?: string
  apellidoClienteCasual?: string
  emailClienteCasual?: string
  usuario?: {
    nombre?: string
    apellido?: string
    email?: string
  }
}