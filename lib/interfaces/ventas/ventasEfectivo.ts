import { DetalleVentaItem } from "./detalleVentaItem";

export interface VentaEfectivo {
  nombreClienteCasual?: string;
  apellidoClienteCasual?: string;
  emailClienteCasual?: string;
  items: DetalleVentaItem[];
}