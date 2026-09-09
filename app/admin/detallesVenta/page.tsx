"use client"

import { useState } from "react"
import { Search, Calendar, CreditCard, User, Package, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStateAuth } from "@/hooks/useAuth"
import { ventasApi } from "@/lib/api/ventas"
import Swal from "sweetalert2"
import { DetalleVentaResponse } from "@/lib/interfaces/ventas/detalleVentaResponse"


export default function DetalleVentaPage() {
  const { token } = useStateAuth()
  const [searchId, setSearchId] = useState("")
  const [loading, setLoading] = useState(false)
  const [venta, setVenta] = useState<DetalleVentaResponse | null>(null)

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchId.trim()) {
      Swal.fire("Atención", "Ingresá un ID de venta válido", "warning")
      return
    }

    try {
      setLoading(true)
      const data = await ventasApi.verPorId(token || "", searchId.trim())
      
      if (!data) {
        setVenta(null)
        Swal.fire("Sin resultados", "No se encontró ninguna venta con ese ID", "info")
        return
      }

      setVenta(data)
    } catch (error: any) {
      setVenta(null)
      Swal.fire({
        icon: "error",
        title: "Error al buscar venta",
        text: error.message || "No se pudo obtener el detalle de la venta",
      })
    } finally {
      setLoading(false)
    }
  }

  const limpiarBusqueda = () => {
    setVenta(null)
    setSearchId("")
  }

  const clienteNombre = venta?.nombreClienteCasual 
    ? `${venta.nombreClienteCasual} ${venta.apellidoClienteCasual || ""}`.trim()
    : venta?.usuario 
      ? `${venta.usuario.nombre || ""} ${venta.usuario.apellido || ""}`.trim()
      : "Cliente Casual / Presencial"

  const clienteEmail = venta?.emailClienteCasual || venta?.usuario?.email || "Sin email registrado"

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Buscar Detalle de Venta</h2>
        <p className="text-muted-foreground text-sm">
          Ingresá el ID de la transacción para consultar el comprobante e información completa.
        </p>
      </div>

      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
        <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full space-y-2">
            <Label htmlFor="ventaId" className="text-xs font-semibold uppercase text-muted-foreground">
              ID de la Venta (UUID)
            </Label>
            <Input
              id="ventaId"
              type="text"
              placeholder="Ej: bd510f19-ead4-4543-8908-0e5fee53e57b"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto px-6 cursor-pointer" disabled={loading}>
            {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
            Buscar
          </Button>
        </form>
      </div>

      {venta && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={limpiarBusqueda} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" /> Nueva búsqueda
            </Button>
            <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {venta.estado}
            </span>
          </div>

          <div className="bg-card rounded-xl border shadow-sm overflow-hidden divide-y divide-border">
            <div className="p-6 bg-muted/20 flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-red-600 tracking-wider uppercase">Comprobante de Venta</span>
                <p className="font-mono text-sm text-muted-foreground break-all">ID: {venta.id}</p>
              </div>
              <div className="text-left md:text-right space-y-1">
                <p className="text-xs text-muted-foreground">Monto Total</p>
                <p className="text-3xl font-black text-foreground">
                  ${Number(venta.total).toLocaleString("es-AR")}
                </p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-100">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Fecha y Hora</p>
                  <p className="text-sm font-medium mt-0.5">
                    {new Date(venta.fecha).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Método de Pago</p>
                  <p className="text-sm font-bold mt-0.5 uppercase tracking-wide text-foreground">
                    {venta.metodoPago}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Cliente</p>
                  <p className="text-sm font-medium mt-0.5">{clienteNombre}</p>
                  <p className="text-xs text-muted-foreground">{clienteEmail}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Ítems Comprados</h3>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium border-b">
                    <tr>
                      <th className="p-3">Producto / Marca</th>
                      <th className="p-3 text-center">Cantidad</th>
                      <th className="p-3 text-right">Precio Unitario</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {venta.detalle_venta?.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/10">
                        <td className="p-3">
                          <p className="font-semibold text-foreground">
                            {item.producto?.nombre || "Producto sin nombre"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.producto?.marca || "Sin marca"}
                          </p>
                        </td>
                        <td className="p-3 text-center font-semibold">{item.cantidad}</td>
                        <td className="p-3 text-right">${Number(item.precio).toLocaleString("es-AR")}</td>
                        <td className="p-3 text-right font-bold text-foreground">
                          ${(item.cantidad * item.precio).toLocaleString("es-AR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}