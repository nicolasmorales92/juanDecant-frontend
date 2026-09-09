export interface UsuarioPerfil {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  provincia?: string;
  ciudad?: string;
  calle?: string;
  rol: string;
}