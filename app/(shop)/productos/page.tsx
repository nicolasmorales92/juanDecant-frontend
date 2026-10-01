'use client';

import { useState } from 'react';
import Filtros from './componentes/filtros';
import ScrollProductos from './componentes/scrollProductos';
import { useSearchParams } from 'next/navigation';

export default function ProductosPage() {
  const searchParams = useSearchParams();

  // Leer los valores directamente de la URL desde el primer render
  const [genero, setGenero] = useState<string>(() => searchParams.get('genero') || 'todas');
  const [mililitros, setMililitros] = useState<string>(() => searchParams.get('mililitros') || 'todos');
  const [ordenPrecio, setOrdenPrecio] = useState<string>(() => searchParams.get('orden') || 'ninguno');

  return (
    <div className="m-6 p-8">
      {genero !== 'todas' && (
        <h2 className="text-xl font-bold mb-4 capitalize text-zinc-700">
          Categoría: {genero}
        </h2>
      )}

      <Filtros 
        setGenero={setGenero}
        setMililitros={setMililitros} 
        setOrden={setOrdenPrecio} 
        generoActual={genero}
        mililitroActual={mililitros}
        ordenActual={ordenPrecio}
      />

      <ScrollProductos 
        genero={genero}
        mililitros={mililitros}
        ordenPrecio={ordenPrecio}
      />
    </div>
  );
}