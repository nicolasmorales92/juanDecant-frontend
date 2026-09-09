"use client"

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStateAuth } from "@/hooks/useAuth";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useStoreCarrito } from "@/hooks/useStoreCarrito";
import Link from "next/link";

export default function CarritoPage() {
  const { carrito, sumarAlCarrito, restarAlCarrito, calcularTotal } = useStoreCarrito();
  const [cargando, setCargando] = useState(false);
  const { estaAutenticado, token, logout } = useStateAuth(); 
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL

  const handleIniciarCompra = async () => {
    try {
      setCargando(true);

      if (!token) {
        Swal.fire("Sesión requerida", "Por favor, inicia sesión para continuar.", "warning");
        router.push("/auth/login");
        return;
      }

      const payload = {
        items: carrito.map((item) => ({
          productoId: item.id,
          varianteId: item.varianteId,
          cantidad: Number(item.cantidad),
        })),
      };

      const locale = Intl.DateTimeFormat().resolvedOptions().locale;
      const region = locale.split('-')[1] || 'AR';

      const response = await fetch(`${api}/ventas/mercadopago`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-region": region,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        logout();
        Swal.fire({
          icon: "warning",
          title: "Sesión expirada",
          text: "Tu sesión ha caducado. Por favor, vuelve a ingresar.",
        });
        router.push("/auth/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al generar la orden de pago");
      }

      const data = await response.json();

      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        alert("No se pudo obtener el enlace de pago de Mercado Pago.");
      }
    } catch (error: any) {
      console.error("Error al iniciar compra:", error);
      alert(error.message || "No se pudo procesar el pago.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!estaAutenticado) {
      Swal.fire({
        text: 'Debés estar registrado para ver tu carrito.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ir a Iniciar Sesión',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/auth/login');
        }
      });
    }
  }, [estaAutenticado, router]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-black mb-6">Tu Carrito de Compras</h1>

      {carrito.length === 0 ? (
        <p className="text-muted-foreground text-center py-10">El carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
          {carrito.map((item) => {
            const varianteElegida = item.variantes?.find((v) => v.id === item.varianteId);

            return (
              <Card key={item.cartItemId} className="flex flex-row items-center justify-between p-4 rounded-xl border">

                <div className="h-20 w-20 rounded-lg bg-muted/50 overflow-hidden border border-border/50">
                  <img src={item.imagenes?.[0]} alt={`${item.nombre} - ${item.marca}`} />
                </div>

                <div className="flex flex-col min-w-0 mr-auto text-left">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">{item.marca}</span>
                  <h3 className="text-sm font-bold text-foreground">{item.nombre}</h3>
                  <p className="text-xs text-muted-foreground">
                    {varianteElegida ? `${varianteElegida.mililitros} ml` : 'Medida estándar'}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => restarAlCarrito(item.cartItemId)}>-</Button>
                    <span className="font-bold text-sm w-4 text-center">{item.cantidad}</span>
                    <Button size="sm" variant="outline" onClick={() => sumarAlCarrito(item.cartItemId)}>+</Button>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black">${(item.precioSeleccionado * item.cantidad).toLocaleString('es-AR')}</span>
                  </div>
                </div>

              </Card>
            );
          })}

          <div className="mt-6 p-4 border-t flex justify-between items-center bg-muted/20 rounded-xl">
            <span className="text-lg font-bold">Total Compra:</span>
            <span className="text-xl font-black">${calcularTotal().toLocaleString('es-AR')}</span>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              size="lg"
              disabled={cargando}
              className="w-full sm:w-auto font-bold px-8 shadow-md rounded-xl cursor-pointer bg-foreground text-background hover:bg-foreground/90 transition-colors"
              onClick={handleIniciarCompra}
            >
              {cargando ? "Procesando..." : "Iniciar Compra"}
            </Button>
          </div>
        </div>
      )}
     <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border/60 text-center space-y-1">
  <p className="text-m text-muted-foreground">
    ¿Querés hacer compras en efectivo?
  </p>
  <Link 
    href="/soporte/contacto" 
    className="inline-block text-l font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors"
  >
    Comunicate con soporte 
  </Link>
</div>
    </div>
  );
}