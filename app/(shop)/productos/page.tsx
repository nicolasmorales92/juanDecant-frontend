'use client'

import { useState, useEffect } from 'react';
import Filtros from './componentes/filtros';
import ScrollProductos from './componentes/scrollProductos';
import { useSearchParams, useParams } from 'next/navigation';
import { Productos } from '@/lib/interfaces/productos/producto';
import { productosApi } from '@/lib/api/productos'; 

export default function ProductosPage() {
  const searchParams = useSearchParams();

  const query = searchParams.get('query') || ''
  const genero = searchParams.get('genero') || ''

  const [productos, setProductos] = useState<Productos[]>([]);
  const [loading, setLoading] = useState(true);
  const [mililitros, setMililitros] = useState<string>('todos');
  const [ordenPrecio, setOrdenPrecio] = useState<string>('ninguno');

  useEffect(() => {
  const cargarProductos = async () => {
    try {
      setLoading(true);
      let datos: Productos[] = [];

      if (genero) {
        datos = await productosApi.buscarPorGenero(genero);
      } else {
        datos = await productosApi.obtenerProductos({ query });
      }

      setProductos(datos);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  cargarProductos();
}, [query, genero]);

  const productosFiltradosYOrdenados = productos
    .filter(prod => {
      return mililitros === 'todos' || prod.variantes?.some(v => String(v.mililitros) === mililitros);
    })
    .sort((a, b) => {
      if (ordenPrecio === 'ninguno') return 0;

      const variantesValidasA = mililitros === 'todos' 
        ? a.variantes 
        : a.variantes?.filter(v => String(v.mililitros) === mililitros) || [];

      const variantesValidasB = mililitros === 'todos' 
        ? b.variantes 
        : b.variantes?.filter(v => String(v.mililitros) === mililitros) || [];

      const precioA = variantesValidasA.length > 0 
        ? Math.min(...variantesValidasA.map(v => v.precio)) 
        : 0;

      const precioB = variantesValidasB.length > 0 
        ? Math.min(...variantesValidasB.map(v => v.precio)) 
        : 0;

      if (ordenPrecio === 'barato') return precioA - precioB;
      if (ordenPrecio === 'caro') return precioB - precioA;
      return 0;
    });

  return (
    <div className="m-6 p-8">
      {genero && (
        <h2 className="text-xl font-bold mb-4 capitalize text-zinc-700">
          Categoría: {genero.replace('-', ' ')}
        </h2>
      )}

      <Filtros 
        setMililitros={setMililitros} 
        setOrden={setOrdenPrecio} 
        mililitroActual={mililitros}
        ordenActual={ordenPrecio}
      />

      {loading ? (
        <div className="text-center py-10">Cargando productos...</div>
      ) : (
        <ScrollProductos 
          productosAmostrar={productosFiltradosYOrdenados} 
          setProductos={setProductos} 
        />
      )}
    </div>
  );
}