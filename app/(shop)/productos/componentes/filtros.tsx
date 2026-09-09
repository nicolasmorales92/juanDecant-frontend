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
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface FiltrosProps {
  setMililitros: (mililitros: string) => void;
  setOrden: (orden: string) => void;
  mililitroActual: string;
  ordenActual: string;
}

export default function Filtros({ setMililitros, setOrden }: FiltrosProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query') || '';
  const [busqueda, setBusqueda] = useState(queryParam);

  useEffect(() => {
    setBusqueda(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (busqueda.trim() === queryParam) return;

      const params = new URLSearchParams(searchParams.toString());
      if (busqueda.trim()) {
        params.set('query', busqueda.trim());
      } else {
        params.delete('query');
      }

      router.push(`/productos?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(timer);
  }, [busqueda, queryParam, searchParams, router]);

  const handleGeneroChange = (genero: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (genero === 'todas') {
      params.delete('genero');
    } else {
      params.set('genero', genero);
    }
    const queryString = params.toString();
    const targetUrl = queryString ? `/productos?${queryString}` : '/productos';
    router.push(targetUrl, { scroll: false });
  };

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
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-1.5 px-2.5 sm:px-3 h-10 text-[11px] sm:text-xs rounded-xl"
            >
              <span className="truncate">Género</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleGeneroChange('todas')}>
              Todos los géneros
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleGeneroChange('hombre')}>
              Hombre
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleGeneroChange('mujer')}>
              Mujer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleGeneroChange('unisex')}>
              Unisex
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-1.5 px-2.5 sm:px-3 h-10 text-[11px] sm:text-xs rounded-xl"
            >
              <span className="truncate">Tamaños</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setMililitros('todos')}>
              Todos los tamaños
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMililitros('5')}>
              5 ml
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMililitros('2.5')}>
              2.5 ml
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-1.5 px-2.5 sm:px-3 h-10 text-[11px] sm:text-xs rounded-xl"
            >
              <span className="truncate">Ordenar</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setOrden('barato')}>
              Menor precio
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOrden('caro')}>
              Mayor precio
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  );
}