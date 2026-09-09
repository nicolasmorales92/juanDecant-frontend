export interface VentasMP {
  id: string;
  usuarioId: string;
  fecha: string | Date;
  total: number;
  detalle_venta?: any[];
}