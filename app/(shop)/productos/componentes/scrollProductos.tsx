'use client'


import { useEffect, useRef, useState } from 'react';
import TarjetaProducto from './tarjetaProducto';
import { useSearchParams } from 'next/navigation';
import { Productos } from '@/lib/interfaces/productos/producto';
import { productosApi } from '@/lib/api/productos';

interface ScrollProductosProps {
  genero: string;
  mililitros: string;
  ordenPrecio: string;
}

export default function ScrollProductos({ genero, mililitros, ordenPrecio }: ScrollProductosProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const [productos, setProductos] = useState<Productos[]>([]);
  const [pagina, setPagina] = useState(1);
  const [masProductos, setMasProductos] = useState(true);
  const [cargando, setCargando] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProductos([]);
    setPagina(1);
    setMasProductos(true);
  }, [query]);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setCargando(true);
      try {
        const nuevos = await productosApi.obtenerProductos({ query, page: pagina, limit: 6 });

        if (!cancelado) {
          if (pagina === 1) {
            setProductos(nuevos);
          } else {
            setProductos((prev) => [...prev, ...nuevos]);
          }

          if (nuevos.length < 6) {
            setMasProductos(false);
          }
        }
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargar();

    return () => {
      cancelado = true;
    };
  }, [pagina, query]);

  useEffect(() => {
    if (!loaderRef.current || !masProductos || cargando) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPagina((prev) => prev + 1);
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [masProductos, cargando]);

  const productosFiltrados = productos
    .filter((p) => {
      const coincideGenero =
        genero === 'todas' ||
        !genero ||
        (p.genero && p.genero.toLowerCase() === genero.toLowerCase()) 

      const coincideTamaño =
        mililitros === 'todos' ||
        p.variantes?.some((v) => String(v.mililitros) === mililitros);

      return coincideGenero && coincideTamaño;
    })
    .sort((a, b) => {
      if (ordenPrecio === 'ninguno') return 0;
      const vA = mililitros === 'todos' ? a.variantes : a.variantes?.filter((v) => String(v.mililitros) === mililitros) || [];
      const vB = mililitros === 'todos' ? b.variantes : b.variantes?.filter((v) => String(v.mililitros) === mililitros) || [];
      const precioA = vA.length > 0 ? Math.min(...vA.map((v) => v.precio)) : 0;
      const precioB = vB.length > 0 ? Math.min(...vB.map((v) => v.precio)) : 0;
      return ordenPrecio === 'barato' ? precioA - precioB : precioB - precioA;
    });

  return (
    <div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 my-4 max-w-6xl mx-auto">
        {productosFiltrados.map((prod) => (
          <TarjetaProducto key={prod.id} prod={prod} />
        ))}
      </ul>

      <div ref={loaderRef} className="text-center py-6">
        {cargando && <p className="text-zinc-500 font-medium">Cargando más productos...</p>}
        {!masProductos && productosFiltrados.length > 0 && (
          <p className="text-gray-400 text-sm">Has llegado al final del catálogo.</p>
        )}
        {!cargando && productosFiltrados.length === 0 && (
          <p className="text-gray-500">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
}