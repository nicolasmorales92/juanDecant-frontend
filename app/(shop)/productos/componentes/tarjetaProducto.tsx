'use client';

import { useRouter } from "next/navigation";
import { Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Swal from 'sweetalert2';
import { Productos } from "@/lib/interfaces/productos/producto";
import { useStoreCarrito } from "@/hooks/useStoreCarrito";
import { Variantes } from "@/lib/interfaces/productos/variantes";

export default function TarjetaProducto({ prod }: { prod: Productos }) {
  const router = useRouter();
  const agregarAlCarrito = useStoreCarrito((state) => state.agregarAlCarrito);

  const handleAgregarCarrito = (variante: Variantes) => {
    agregarAlCarrito(prod, variante);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Añadido al carrito',
      text: prod.nombre,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: 'var(--background)',
      color: 'var(--foreground)',
    });
  };

  const handleVerMas = () => {
    router.push(`/productos/${prod.id}`);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Contenedor Swiper con CSS inyectado para forzar la visibilidad de flechas */}
      <div className="relative h-48 w-full bg-muted/30 overflow-hidden shrink-0 
        [&_.swiper-button-next]:text-zinc-900 [&_.swiper-button-prev]:text-zinc-900 
        [&_.swiper-button-next]:after:text-sm [&_.swiper-button-prev]:after:text-sm 
        [&_.swiper-button-next]:opacity-100 [&_.swiper-button-prev]:opacity-100">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={true}
          pagination={{ clickable: true }}
          className="w-full h-full custom-swiper-cards"
        >
          {prod.imagenes?.map((url: string, index: number) => (
            <SwiperSlide key={index} className="items-center justify-center w-full h-full p-2" style={{ display: 'flex' }}>
              <img
                src={url}
                alt={`${prod.nombre} - ${index}`}
                onClick={handleVerMas}
                className="object-contain max-h-full max-w-full mx-auto cursor-pointer group-hover:scale-105 transition-transform duration-500"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex flex-col justify-between p-3">
        <CardHeader className="p-0 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {prod.marca}
          </p>
          <CardTitle className="text-sm font-bold tracking-tight text-foreground line-clamp-2">
            {prod.nombre}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 mt-2">
          <button
            onClick={handleVerMas}
            className="text-xs font-medium text-muted-foreground hover:text-foreground text-left transition-colors cursor-pointer underline"
          >
            Ver más detalles...
          </button>
        </CardContent>
      </div>

      <CardFooter className="p-3 flex flex-col gap-2 mt-auto border-t border-border/40 bg-muted/5">
        {prod.variantes?.map((variante: any, idx: number) => (
          <div key={variante.id || idx} className="flex items-center justify-between gap-2 w-full text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded text-[11px]">
                {variante.mililitros}ml
              </span>
              <span className="font-bold text-foreground text-sm">
                ${variante.precio?.toLocaleString('es-AR')}
              </span>
            </div>

            <Button
              size="icon"
              className="h-8 w-8 rounded-lg shrink-0 shadow-sm cursor-pointer hover:scale-105 transition-transform"
              title="Añadir al carrito"
              onClick={() => handleAgregarCarrito(variante)}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}