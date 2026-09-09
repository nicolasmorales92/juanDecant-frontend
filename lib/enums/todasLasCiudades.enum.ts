import { BarriosBuenoAiresEnum } from "./barriosBuenosAires.enum";
import { BarriosCABAEnum } from "./barriosCaba.enum";
import { ProvinciasEnum } from "./provincias.enum";

export const TodasLasCiudadesEnum = {
  ...BarriosCABAEnum,
  ...BarriosBuenoAiresEnum,
};

export const CiudadesPorProvincia: Record<string, string[]> = {
  [ProvinciasEnum.CABA]: Object.values(BarriosCABAEnum),
  [ProvinciasEnum.BUENOS_AIRES]: Object.values(BarriosBuenoAiresEnum),
};