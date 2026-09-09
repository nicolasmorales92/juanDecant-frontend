import { Productos } from "../productos/producto";

export interface Venta {
  id: string;
  fecha: string;
  total: number;
  nombreClienteCasual?: string;
  apellidoClienteCasual?: string;
  emailClienteCasual?: string;
  detalles: Array<{
    id: string;
    cantidad: number;
    precioUnitario: number;
    producto: Productos;
  }>;
}