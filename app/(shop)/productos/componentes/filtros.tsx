'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface FiltrosProps {
  generoActual: string;
  mililitroActual: string;
  ordenActual: string;
}

export default function Filtros({
  generoActual,
  mililitroActual,
  ordenActual,
}: FiltrosProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const queryParam = searchParams.get('query') || '';
  const [busqueda, setBusqueda] = useState(queryParam);

  const aplicarFiltro = (clave: string, valor: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (valor && valor !== 'todas' && valor !== 'todos' && valor !== 'ninguno') {
      params.set(clave, valor);
    } else {
      params.delete(clave);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (busqueda.trim() === queryParam) return;
      aplicarFiltro('query', busqueda.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [busqueda]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 w-full">
      <div className="relative w-full sm:max-w-xs md:max-w-sm shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscá tu perfume o marca..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-9 pr-4 h-10 w-full bg-background border border-border shadow-sm rounded-xl text-sm"
        />
      </div>

      <div className="grid grid-cols-3 sm:flex sm:items-center sm:justify-end gap-1.5 sm:gap-2 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto flex items-center justify-between gap-1.5 h-10 text-xs rounded-xl capitalize">
              <span className="truncate">{generoActual === 'todas' ? 'Género' : generoActual}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => aplicarFiltro('genero', 'todas')}>Todos los géneros</DropdownMenuItem>
            <DropdownMenuItem onClick={() => aplicarFiltro('genero', 'hombre')}>Hombre</DropdownMenuItem>
            <DropdownMenuItem onClick={() => aplicarFiltro('genero', 'mujer')}>Mujer</DropdownMenuItem>
            <DropdownMenuItem onClick={() => aplicarFiltro('genero', 'unisex')}>Unisex</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto flex items-center justify-between gap-1.5 h-10 text-xs rounded-xl">
              <span className="truncate">{mililitroActual === 'todos' ? 'Tamaños' : `${mililitroActual} ml`}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => aplicarFiltro('mililitros', 'todos')}>Todos los tamaños</DropdownMenuItem>
            <DropdownMenuItem onClick={() => aplicarFiltro('mililitros', '5')}>5 ml</DropdownMenuItem>
            <DropdownMenuItem onClick={() => aplicarFiltro('mililitros', '2.5')}>2.5 ml</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto flex items-center justify-between gap-1.5 h-10 text-xs rounded-xl">
              <span className="truncate">{ordenActual === 'barato' ? 'Menor precio' : ordenActual === 'caro' ? 'Mayor precio' : 'Ordenar'}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => aplicarFiltro('orden', 'barato')}>Menor precio</DropdownMenuItem>
            <DropdownMenuItem onClick={() => aplicarFiltro('orden', 'caro')}>Mayor precio</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}