import { Venta } from "../interfaces/ventas/responseVenta";
import { VentaEfectivo } from "../interfaces/ventas/ventasEfectivo";

const api = process.env.NEXT_PUBLIC_API_URL

export const ventasApi = {
  verVentasAdmin: async (token: string, page = 1, limit = 10) => {
    const res = await fetch(`${api}/ventas?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      })
    });

    if (!res.ok) throw new Error(`Error al obtener ventas: ${res.statusText}`);
    return res.json();
  },






   verVentasUsuario: async (token: string, page = 1, limit = 10) => {
    const res = await fetch(`${api}/ventas/compras?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      })
    });

    if (!res.ok) throw new Error(`Error al obtener ventas: ${res.statusText}`);
    return res.json();
  },



  verPorId: async (token: string, id: string) => {
    const res = await fetch(`${api}/ventas/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || `Error al obtener la venta: ${res.statusText}`);
    }

    return res.json();
  },


  crearVentaEfectivo: async (token: string, dto: VentaEfectivo): Promise<Venta> => {
    const res = await fetch(`${api}/ventas/efectivo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (!res.ok) throw new Error(`Error al registrar la venta: ${res.statusText}`);
    return res.json();

  }

}