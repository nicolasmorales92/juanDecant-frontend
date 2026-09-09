import { UpdatePerfil } from "../interfaces/usuario/updatePerfil";
import { UsuarioPerfil } from "../interfaces/usuario/verPerfil";

const api = process.env.NEXT_PUBLIC_API_URL



export const usuariosApi = {
    verUsuarios: async (token: string, page = 1, limit = 10) => {
    const res = await fetch(`${api}/usuarios?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      })
    });

    if (!res.ok) throw new Error(`Error al obtener usuarios: ${res.statusText}`);
    return res.json();
  },





  obtenerMiPerfil: async (token: string): Promise<UsuarioPerfil> => {
    const res = await fetch(`${api}/usuarios/mi-perfil`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al obtener los datos del perfil');
    }

    return res.json();
  },


  

  actualizarMiPerfil: async (token: string, datos: UpdatePerfil): Promise<UsuarioPerfil> => {
    const res = await fetch(`${api}/usuarios/mi-perfil`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al actualizar el perfil');
    }

    return res.json();
  },



 

};
