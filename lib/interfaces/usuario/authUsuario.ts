export interface Usuario {
  id?: string;
  nombre: string;
  email: string;
}

export interface StateAuth {
  usuario: Usuario | null;
  token: string | null;
  estaAutenticado: boolean;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
}