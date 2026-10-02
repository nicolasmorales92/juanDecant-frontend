'use client';

import { useEffect, useState, useMemo } from 'react';
import TarjetaProducto from './tarjetaProducto';
import { useSearchParams } from 'next/navigation';
import { Productos } from '@/lib/interfaces/productos/producto';
import { productosApi } from '@/lib/api/productos';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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

  useEffect(() => {
    let cancelado = false

    const fetchInicial = async () => {
      setCargando(true)
      setPagina(1)
      try {
        const nuevos = await productosApi.obtenerProductos({ query, page: 1, limit: 6 });
        if (!cancelado) {
          setProductos(nuevos || []);
          setMasProductos((nuevos?.length || 0) === 6);
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    fetchInicial();

    return () => {
      cancelado = true;
    };
  }, [query]);

  const handleVerMas = async () => {
    if (cargando || !masProductos) return;

    const siguientePagina = pagina + 1;
    setCargando(true);

    try {
      const nuevos = await productosApi.obtenerProductos({ query, page: siguientePagina, limit: 6 });
      
      if (!nuevos || nuevos.length === 0) {
        setMasProductos(false);
      } else {
        setProductos((prev) => [...prev, ...nuevos]);
        setPagina(siguientePagina);
        if (nuevos.length < 6) setMasProductos(false);
      }
    } catch (err) {
      console.error("Error al cargar más productos:", err);
    } finally {
      setCargando(false);
    }
  };

  const productosFiltrados = useMemo(() => {
    return productos
      .filter((p) => {
        const coincideGenero =
          genero === 'todas' ||
          !genero ||
          (p.genero && p.genero.toLowerCase() === genero.toLowerCase());

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
  }, [productos, genero, mililitros, ordenPrecio]);

  return (
    <div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 my-4 max-w-6xl mx-auto">
        {productosFiltrados.map((prod) => (
          <TarjetaProducto key={prod.id} prod={prod} />
        ))}
      </ul>

      <div className="flex flex-col items-center justify-center py-8 min-h-[80px]">
        {masProductos && (
          <Button
            onClick={handleVerMas}
            disabled={cargando}
            variant="outline"
            className="px-6 py-2 rounded-xl font-medium shadow-sm cursor-pointer"
          >
            {cargando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </>
            ) : (
              'Ver más productos'
            )}
          </Button>
        )}

        {!masProductos && productosFiltrados.length > 0 && (
          <p className="text-muted-foreground text-sm">Has llegado al final del catálogo.</p>
        )}

        {!cargando && productosFiltrados.length === 0 && (
          <p className="text-muted-foreground">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
}