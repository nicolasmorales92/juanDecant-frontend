'use client';

import { useEffect, useState } from 'react';
import { Calendar, Hash, PackageCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useStateAuth } from '@/hooks/useAuth';
import Swal from 'sweetalert2';
import { VentasMP } from '@/lib/interfaces/ventas/ventasMP';
import { ventasApi } from '@/lib/api/ventas';
import Image from 'next/image';

export default function MisComprasPage() {
  const [compras, setCompras] = useState<VentasMP[]>([]);
  const [loading, setLoading] = useState(true);
  const [desplegados, setDesplegados] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { estaAutenticado, token } = useStateAuth();
  const [page] = useState(1);
  const limit = 10;

  useEffect(() => {
    const traerCompras = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const datos = await ventasApi.verVentasUsuario(token, page, limit);
        setCompras(Array.isArray(datos) ? datos : []);
      } catch (error) {
        console.error("Error al cargar el historial de compras:", error);
      } finally {
        setLoading(false);
      }
    };

    traerCompras();
  }, [token, page]);

  useEffect(() => {
    if (!estaAutenticado) {
      Swal.fire({
        text: 'Debés estar registrado para ver tus compras.',
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

  const toggleDesplegar = (id: string) => {
    setDesplegados((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="m-6 p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Mis Compras</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Historial detallado de tus perfumes adquiridos.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground animate-pulse">
          Cargando tu historial de compras...
        </div>
      ) : compras.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl bg-muted/10">
          <p className="text-muted-foreground font-medium">Aún no has realizado ninguna compra.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {compras.map((compra) => {
            const fechaFormateada = new Date(compra.fecha).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const codigoOrden = compra.id.substring(0, 8).toUpperCase();
            const estaAbierto = desplegados[compra.id] ?? true;

            return (
              <div
                key={compra.id}
                className="border border-border rounded-xl bg-card overflow-hidden shadow-sm transition-all duration-200 hover:border-border/80"
              >
                <div className="p-4 bg-muted/30 flex flex-wrap items-center justify-between gap-4 border-b border-border/50">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Hash className="h-3 w-3" /> Orden
                      </p>
                      <p className="text-sm font-mono font-bold text-foreground">
                        #{codigoOrden}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Fecha
                      </p>
                      <p className="text-xs font-medium text-foreground">
                        {fechaFormateada} hs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Total Abonado
                      </p>
                      <p className="text-base font-black text-foreground">
                        ${compra.total.toLocaleString('es-AR')}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleDesplegar(compra.id)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                      title={estaAbierto ? "Ocultar detalles" : "Ver detalles"}
                    >
                      {estaAbierto ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {estaAbierto && (
                  <div className="p-4 divide-y divide-border/40">
                    {compra.detalle_venta?.map((item: any) => {
                      const producto = item.producto;
                      const variante = item.variante;
                      const imagenUrl = producto?.imagen || producto?.imagenes?.[0] || '/placeholder-perfume.png';

                      return (
                        <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-14 rounded-md overflow-hidden bg-muted/50 border border-border/60 shrink-0">
                              <Image
                                src={imagenUrl}
                                alt={producto?.nombre || 'Perfume'}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-foreground line-clamp-1">
                                {producto?.nombre || 'Perfume sin nombre'}
                              </p>

                              <p className="text-xs text-muted-foreground mt-0.5">
                                Cantidad: <span className="font-semibold text-foreground">{item.cantidad}</span>
                              </p>

                              {variante && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Mililitros:{' '}
                                  <span className="font-medium text-foreground">
                                    {variante.mililitros ||  'N/A'}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-xs text-muted-foreground">Precio unitario</p>
                            <p className="text-sm font-bold text-foreground">
                              ${item.precio_unitario?.toLocaleString('es-AR') || (compra.total / item.cantidad).toLocaleString('es-AR')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}