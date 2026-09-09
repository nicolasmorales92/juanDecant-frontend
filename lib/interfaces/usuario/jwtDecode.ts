export interface JwtPayload {
  id: string;
  sub: string;
  rol: string; 
  exp: number;
  iat: number;
}