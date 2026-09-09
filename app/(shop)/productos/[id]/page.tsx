'use client';

import { useEffect, useState, use } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Productos } from "@/lib/interfaces/productos/producto";
import { Variantes } from "@/lib/interfaces/productos/variantes";
import { useStoreCarrito } from "@/hooks/useStoreCarrito";
import { productosApi } from "@/lib/api/productos"; 

export default function PaginaDetalleProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [prod, setProducto] = useState<Productos | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<Variantes | null>(null);

  const agregarAlCarrito = useStoreCarrito((state) => state.agregarAlCarrito);

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        setCargando(true);
        const data = await productosApi.buscarPorId(id);
        setProducto(data);
        if (data.variantes && data.variantes.length > 0) {
          setVarianteSeleccionada(data.variantes[0]);
        }
      } catch (error) {
        console.error("Error al obtener detalle del producto:", error);
      } finally {
        setCargando(false);
      }
    };

    if (id) obtenerProducto();
  }, [id]);

  const handleAgregarCarrito = () => {
    if (!prod || !varianteSeleccionada) return;

    agregarAlCarrito(prod, varianteSeleccionada);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Añadido al carrito',
      text: `${prod.nombre} (${varianteSeleccionada.mililitros}ml)`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: 'var(--background)',
      color: 'var(--foreground)',
    });
  };

  if (cargando) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!prod) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Producto no encontrado</h2>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al catálogo
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="w-full bg-muted/30 rounded-xl overflow-hidden  flex items-center justify-center p-4">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={true}
            pagination={{ clickable: true }}
            className="w-full  custom-swiper-cards"
          >
            {prod.imagenes?.map((url: string, index: number) => (
              <SwiperSlide key={index} className="flex items-center justify-center">
                <img
                  src={url}
                  alt={`${prod.nombre} - ${index}`}
                  className="object-contain max-h-full max-w-full mx-auto"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {prod.marca}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {prod.nombre}
              </h1>
            </div>

            <div className="space-y-2 border-t border-b border-border/60 py-4">
              <h2 className="text-sm font-semibold text-foreground">Descripción</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {prod.descripcion || "Sin descripción disponible."}
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Selecciona la presentación:
              </label>
              <div className="flex flex-wrap gap-2">
                {prod.variantes?.map((v: Variantes) => {
                  const estaSeleccionada = varianteSeleccionada?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVarianteSeleccionada(v)}
                      className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                        estaSeleccionada
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                          : "border-border bg-background text-muted-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {v.mililitros}ml - ${v.precio?.toLocaleString('es-AR')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Precio final</p>
              <p className="text-3xl font-black text-foreground">
                ${varianteSeleccionada?.precio?.toLocaleString('es-AR') ?? 0}
              </p>
            </div>

            <Button
              onClick={handleAgregarCarrito}
              disabled={!varianteSeleccionada}
              className="flex-1 max-w-xs h-12 rounded-xl text-base font-semibold gap-2 shadow-md hover:scale-[1.02] transition-transform"
            >
              <ShoppingCart className="h-5 w-5" />
              Añadir al carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}