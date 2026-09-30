'use client';

import { useEffect, useState } from 'react';
import Filtros from './componentes/filtros';
import ScrollProductos from './componentes/scrollProductos';
import { useSearchParams } from 'next/navigation';

export default function ProductosPage() {
  const [genero, setGenero] = useState<string>('todas');
  const [mililitros, setMililitros] = useState<string>('todos');
  const [ordenPrecio, setOrdenPrecio] = useState<string>('ninguno');

  const searchParams = useSearchParams();
  const generoParam = searchParams.get('genero') || 'todas';
  const mililitrosParam = searchParams.get('mililitros') || 'todos';
  const ordenParam = searchParams.get('orden') || 'ninguno';

  useEffect(() => {
    setGenero(generoParam);
    setMililitros(mililitrosParam);
    setOrdenPrecio(ordenParam);
  }, [generoParam, mililitrosParam, ordenParam]);

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