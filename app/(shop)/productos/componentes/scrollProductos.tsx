'use client';


import { useEffect, useRef, useState } from 'react';
import TarjetaProducto from './tarjetaProducto';
import { useSearchParams } from 'next/navigation';
import { Productos } from '@/lib/interfaces/productos/producto';
import { productosApi } from '@/lib/api/productos';

interface ScrollProductosProps {
  productosAmostrar: Productos[];
  setProductos: React.Dispatch<React.SetStateAction<Productos[]>>;
}

export default function ScrollProductos({ productosAmostrar, setProductos }: ScrollProductosProps) {
  const api = process.env.NEXT_PUBLIC_API_URL;

  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const genero = searchParams.get('genero') || '';

  const [pagina, setPagina] = useState(1);
  const [masProductos, setMasProductos] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPagina(1);
    setMasProductos(true);
  }, [query, genero]);

 const cargarMasProductos = async () => {
  if (loading || !masProductos) return; 
  setLoading(true);

  const proximaPagina = pagina + 1;

  try {
    let nuevosProductos: Productos[] = [];

    if (genero) {
      nuevosProductos = await productosApi.buscarPorGenero(genero, proximaPagina, 6, query);
    } else {
      nuevosProductos = await productosApi.obtenerProductos({
        query,
        page: proximaPagina,
        limit: 6,
      });
    }

    if (Array.isArray(nuevosProductos) && nuevosProductos.length > 0) {
      setProductos((prev) => {
        const idsExistentes = new Set(prev.map((p) => p.id));
        const productosFiltrados = nuevosProductos.filter(
          (prod) => !idsExistentes.has(prod.id)
        );
        return [...prev, ...productosFiltrados];
      });

      setPagina(proximaPagina);

      if (nuevosProductos.length < 6) {
        setMasProductos(false);
      }
    } else {
      setMasProductos(false);
    }
  } catch (error) {
    console.error("Error cargando más productos:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const target = loaderRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && masProductos && !loading) {
          cargarMasProductos();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [loading, masProductos, pagina, query, genero]);

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 m-4 max-w-6xl mx-auto">
        {productosAmostrar.map((prod) => (
          <TarjetaProducto key={prod.id} prod={prod} />
        ))}
      </ul>

      <div ref={loaderRef} className="text-center py-4 text-gray-500 clear-both">
        {loading && <p>Cargando más productos...</p>}
        {!masProductos && productosAmostrar.length > 0 && <p>No hay más productos.</p>}
        {productosAmostrar.length === 0 && !loading && (
          <p className="text-muted-foreground my-8">No se encontraron productos para tu búsqueda.</p>
        )}
      </div>
    </>
  );
}