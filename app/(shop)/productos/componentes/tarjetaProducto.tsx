'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

import Swal from 'sweetalert2';
import { Productos } from "@/lib/interfaces/productos/producto";
import { useStoreCarrito } from "@/hooks/useStoreCarrito";
import { Variantes } from "@/lib/interfaces/productos/variantes";

export default function TarjetaProducto({ prod }: { prod: Productos }) {
  const router = useRouter();
  const agregarAlCarrito = useStoreCarrito((state) => state.agregarAlCarrito);
  const [imgIndex, setImgIndex] = useState(0);

  const imagenes = prod.imagenes && prod.imagenes.length > 0 
    ? prod.imagenes 
    : ['/placeholder.png'];

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

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="relative h-48 w-full bg-muted/30 overflow-hidden shrink-0 flex items-center justify-center p-2">
        <Image
          src={imagenes[imgIndex]}
          alt={`${prod.nombre} - ${imgIndex}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
          onClick={handleVerMas}
          className="object-contain p-2 cursor-pointer group-hover:scale-105 transition-transform duration-300"
        />

        {imagenes.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
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