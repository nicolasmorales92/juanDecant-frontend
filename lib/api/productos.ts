import { useStateAuth } from "@/hooks/useAuth";
import { Productos } from "../interfaces/productos/producto";

const api = process.env.NEXT_PUBLIC_API_URL

export const productosApi = {
  obtenerProductos: async ({
  genero,
  query,
  page = 1,
  limit = 6,
}: {
  genero?: string;
  query?: string;
  page?: number;
  limit?: number;
}): Promise<Productos[]> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (genero) params.append('genero', genero);
    if (query) params.append('search', query);

    const res = await fetch(`${api}/productos?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Error en la petición: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
},


  buscarPorGenero: async (genero: string): Promise<Productos[]> => {
    try {
      const res = await fetch(`${api}/productos/genero/${genero}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!res.ok) {
        throw new Error(`Error en la petición: ${res.status} ${res.statusText}`);
      }

      return await res.json();

    } catch (error) {
      console.error("Error al buscar productos:", error);
      throw error;
    }
  },


  crearProductos: async (formData: FormData): Promise<Productos> => {
    try {
      const token = useStateAuth.getState().token
      if (!token) {
        throw new Error("Token no encontrado.");
      }


      const res = await fetch(`${api}/productos/nuevo`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Error del servidor: ${res.status}`);
      }
      return await res.json();
    }
    catch (error: any) {
      console.error("Error al cargar el producto:", error.message);
      throw error;
    }
  },


  buscarPorId: async (id: string): Promise<Productos> => {
    try {
      const res = await fetch(`${api}/productos/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!res.ok) {
        throw new Error(`Error en la petición: ${res.status} ${res.statusText}`);
      }

      return await res.json();

    } catch (error) {
      console.error("Error al cargar el producto:", error);
      throw error;
    }
  },


  actualizar: async (id: string, data: Partial<Productos>): Promise<Productos> =>{
     try {
      const token = useStateAuth.getState().token
      if (!token) {
        throw new Error("Token no encontrado.");
      }

      const res = await fetch(`${api}/productos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const mensaje = Array.isArray(errorData.message)
        ? errorData.message.join(", ")
        : errorData.message || res.statusText;
      
      throw new Error(`Error ${res.status}: ${mensaje}`);
    }

      return await res.json();

    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw error;
    }
  },


   eliminar: async (id: string): Promise<Productos> => {
    try {
      const token = useStateAuth.getState().token
      if (!token) {
        throw new Error("Token no encontrado.");
      }

      const res = await fetch(`${api}/productos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Error en la petición: ${res.status} ${res.statusText}`);
      }

      return await res.json();

    } catch (error) {
      console.error("Error al cargar el producto:", error);
      throw error;
    }
  }
}