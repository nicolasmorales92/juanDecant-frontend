'use client';

import Filtros from './componentes/filtros';
import ScrollProductos from './componentes/scrollProductos';
import { useSearchParams } from 'next/navigation';

export default function ProductosPage() {
  const searchParams = useSearchParams();

  const genero = searchParams.get('genero') || 'todas';
  const mililitros = searchParams.get('mililitros') || 'todos';
  const ordenPrecio = searchParams.get('orden') || 'ninguno';

  return (
    <div className="m-6 p-8">
      {genero !== 'todas' && (
        <h2 className="text-xl font-bold mb-4 capitalize text-zinc-700">
          Categoría: {genero}
        </h2>
      )}

      <Filtros 
        generoActual={genero}
        mililitroActual={mililitros}
        ordenActual={ordenPrecio}
      />

      <ScrollProductos 
        key={`${genero}-${mililitros}-${ordenPrecio}`} 
        genero={genero}
        mililitros={mililitros}
        ordenPrecio={ordenPrecio}
      />
    </div>
  );
}