import { LoginUsuario } from "../interfaces/usuario/loginUsuario";
import { RegistroUsuario } from "../interfaces/usuario/registroUsuario";

const api = process.env.NEXT_PUBLIC_API_URL

export const authApi = {
    registro: async (dataFormUsuario: RegistroUsuario) => {
        try {
            const res = await fetch(`${api}/auth/registro`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataFormUsuario)
                })
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || `Error del servidor: ${res.status}`);
            }
            return await res.json();
        }
        catch (error: any) {
            console.error("Error al registrar:", error.message);
            throw error;
        }
    },


    login: async(dataLogin: LoginUsuario) =>{
        try{
            const res = await fetch(`${api}/auth/login`, {
                method: 'POST',
                headers: {
                     "Content-Type": "application/json",
                },
                body: JSON.stringify(dataLogin)
            })
            if(!res.ok){
                const error = await res.json();
                throw new Error(error.message || `Error del servidor: ${res.status}`);
            }

            return await res.json()
        }
        catch(error: any){
            console.error('Error al loguearse: ', error.message)
            throw error
        }
    },



    olvideMiContraseña: async(email:string)=>{
         try{
            const res = await fetch(`${api}/auth/olvide-mi-password`, {
                method: 'POST',
                headers: {
                     "Content-Type": "application/json",
                },
                body: JSON.stringify({ email})
            })
            if(!res.ok){
                const error = await res.json();
                throw new Error(error.message || `Error del servidor: ${res.status}`);
            }

            return await res.json()
        }
        catch(error: any){
            console.error('Error al loguearse: ', error.message)
            throw error
        }
    },


   restaurarContraseña: async (dataRestaurar: { token: string; newPassword: string }) => {
  try {
    const res = await fetch(`${api}/auth/restaurar-password`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataRestaurar)
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.log('http:', res.status);
      console.log('error del back:', errorData);
      throw new Error(errorData.message || `Error del servidor: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('Error al restaurar contraseña: ', error);
    throw error;
  }
}
}
