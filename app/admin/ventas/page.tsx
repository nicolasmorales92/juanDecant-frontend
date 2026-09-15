"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, CreditCard, Banknote, RefreshCw, ChevronLeft, ChevronRight, Trash2, User, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useStateAuth } from "@/hooks/useAuth"
import { productosApi } from "@/lib/api/productos"
import { Productos } from "@/lib/interfaces/productos/producto"
import { Venta } from "@/lib/interfaces/ventas/responseVenta"
import Swal from "sweetalert2"
import { ventasApi } from "@/lib/api/ventas"
import { ItemVenta } from "@/lib/interfaces/ventas/itemVenta"


export default function VentasPage() {
  const { token } = useStateAuth()
  const [ventas, setVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const limit = 10

  const [filtroMetodo, setFiltroMetodo] = useState<string>("todos")
  const [ordenFecha, setOrdenFecha] = useState<"desc" | "asc">("desc")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [listaProductos, setListaProductos] = useState<Productos[]>([])

  const [formEfectivo, setFormEfectivo] = useState({
    nombreClienteCasual: "",
    apellidoClienteCasual: "",
    emailClienteCasual: "",
    items: [] as ItemVenta[],
  })

  const [itemActual, setItemActual] = useState({
    productoId: "",
    varianteId: "",
    cantidad: 1,
  })

  const cargarVentas = async () => {
    if (!token) return
    try {
      setLoading(true)
      const data = await ventasApi.verVentasAdmin(token, page, limit)
      setVentas(Array.isArray(data) ? data : (data as any)?.data || [])
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar ventas",
        text: error.message || "No se pudieron obtener los registros",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await productosApi.obtenerProductos({ limit: 100 })
        const lista = Array.isArray(res) ? res : (res as any)?.data || []
        setListaProductos(lista)
      } catch (err) {
        console.error("Error al obtener catálogo de productos:", err)
      }
    }
    fetchProductos()
  }, [])

  useEffect(() => {
    cargarVentas()
  }, [page, token])

  const ventasProcesadas = useMemo(() => {
    let resultado = [...ventas]

    if (filtroMetodo !== "todos") {
      resultado = resultado.filter((v: any) => {
        const metodo = (v.metodoPago || v.tipo || "").toLowerCase()
        if (filtroMetodo === "efectivo") {
          return metodo === "efectivo"
        }
        if (filtroMetodo === "mercadopago") {
          return metodo !== "efectivo"
        }
        return true
      })
    }

    resultado.sort((a: any, b: any) => {
      const fechaA = new Date(a.fecha || 0).getTime()
      const fechaB = new Date(b.fecha || 0).getTime()

      return ordenFecha === "desc" ? fechaB - fechaA : fechaA - fechaB
    })

    return resultado
  }, [ventas, filtroMetodo, ordenFecha])

  const productoSeleccionado = listaProductos.find((p) => p.id === itemActual.productoId)

  const agregarItem = () => {
    if (!itemActual.productoId || !itemActual.varianteId) {
      Swal.fire("Atención", "Seleccioná un producto y su variante.", "warning")
      return
    }

    setFormEfectivo((prev) => ({
      ...prev,
      items: [...prev.items, { ...itemActual }],
    }))

    setItemActual({ productoId: "", varianteId: "", cantidad: 1 })
  }

  const removerItem = (index: number) => {
    setFormEfectivo((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleCrearVentaEfectivo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    if (formEfectivo.items.length === 0) {
      Swal.fire("Atención", "Debés agregar al menos un ítem a la venta.", "warning")
      return
    }

    try {
      setSubmitting(true)
      
      const payload = {
        nombreClienteCasual: formEfectivo.nombreClienteCasual || undefined,
        apellidoClienteCasual: formEfectivo.apellidoClienteCasual || undefined,
        emailClienteCasual: formEfectivo.emailClienteCasual || undefined,
        items: formEfectivo.items,
      }

      await ventasApi.crearVentaEfectivo(token, payload as any)

      Swal.fire({
        icon: "success",
        title: "¡Venta registrada!",
        text: "La venta en efectivo se guardó correctamente.",
        timer: 2000,
        showConfirmButton: false,
      })

      setIsModalOpen(false)
      setFormEfectivo({
        nombreClienteCasual: "",
        apellidoClienteCasual: "",
        emailClienteCasual: "",
        items: [],
      })
      cargarVentas()
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al crear la venta",
        text: error.message || "Hubo un fallo al procesar la solicitud",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Historial de Ventas</h2>
          <p className="text-muted-foreground text-sm">
            Visualizá los ingresos por MercadoPago y cobros presenciales.
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white gap-2 cursor-pointer">
              <Plus className="w-4 h-4" /> Nueva Venta (Efectivo)
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Registrar Venta en Efectivo</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleCrearVentaEfectivo} className="space-y-4 py-2">
              
              <div className="border p-3 rounded-lg bg-muted/20 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Datos del Cliente (Opcional)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="nombre" className="text-xs">Nombre</Label>
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Javier"
                      value={formEfectivo.nombreClienteCasual}
                      onChange={(e) => setFormEfectivo({ ...formEfectivo, nombreClienteCasual: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="apellido" className="text-xs">Apellido</Label>
                    <Input
                      id="apellido"
                      type="text"
                      placeholder="Mora"
                      value={formEfectivo.apellidoClienteCasual}
                      onChange={(e) => setFormEfectivo({ ...formEfectivo, apellidoClienteCasual: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="javier@example.com"
                    value={formEfectivo.emailClienteCasual}
                    onChange={(e) => setFormEfectivo({ ...formEfectivo, emailClienteCasual: e.target.value })}
                  />
                </div>
              </div>

              <div className="border p-3 rounded-lg space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Agregar Ítems a la Venta
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Producto</Label>
                    <select
                      className="w-full text-xs h-9 border rounded-md px-2 bg-background"
                      value={itemActual.productoId}
                      onChange={(e) => setItemActual({ ...itemActual, productoId: e.target.value, varianteId: "" })}
                    >
                      <option value="">Seleccionar...</option>
                      {listaProductos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} ({p.marca})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs">Variante / Medida</Label>
                    <select
                      className="w-full text-xs h-9 border rounded-md px-2 bg-background"
                      disabled={!productoSeleccionado}
                      value={itemActual.varianteId}
                      onChange={(e) => setItemActual({ ...itemActual, varianteId: e.target.value })}
                    >
                      <option value="">Seleccionar...</option>
                      {productoSeleccionado?.variantes?.map((v: any, idx: number) => (
                        <option key={v.id || idx} value={v.id}>
                          {v.mililitros}ml - ${v.precio} (Stock: {v.stock})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 items-end">
                    <div className="w-1/2">
                      <Label className="text-xs">Cant.</Label>
                      <Input
                        type="number"
                        min="1"
                        className="h-9 text-xs"
                        value={itemActual.cantidad}
                        onChange={(e) => setItemActual({ ...itemActual, cantidad: Number(e.target.value) })}
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={agregarItem}
                      className="bg-slate-800 text-white hover:bg-slate-900 h-9"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {formEfectivo.items.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Detalle de la venta:</p>
                    <div className="max-h-32 overflow-y-auto space-y-1 border-t pt-2">
                      {formEfectivo.items.map((it, idx) => {
                        const prod = listaProductos.find((p) => p.id === it.productoId)
                        const varItem = prod?.variantes?.find((v: any) => v.id === it.varianteId)

                        return (
                          <div key={idx} className="flex justify-between items-center text-xs bg-muted/40 p-2 rounded">
                            <span>
                              <strong>{prod?.nombre}</strong> ({varItem?.mililitros}ml) x {it.cantidad} un.
                            </span>
                            <div className="flex items-center gap-2">
                              <span>${((varItem?.precio || 0) * it.cantidad).toLocaleString("es-AR")}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-600 hover:bg-red-50"
                                onClick={() => removerItem(idx)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={submitting}>
                  {submitting ? "Guardando..." : "Confirmar Venta"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase">Filtrar Método:</span>
          <select
            className="text-xs h-9 border rounded-md px-3 bg-background font-medium focus:outline-none focus:ring-1 focus:ring-red-600"
            value={filtroMetodo}
            onChange={(e) => setFiltroMetodo(e.target.value)}
          >
            <option value="todos">Todos los métodos</option>
            <option value="efectivo">Efectivo</option>
            <option value="mercadopago">MercadoPago</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase">Orden Fecha:</span>
          <select
            className="text-xs h-9 border rounded-md px-3 bg-background font-medium focus:outline-none focus:ring-1 focus:ring-red-600"
            value={ordenFecha}
            onChange={(e) => setOrdenFecha(e.target.value as "desc" | "asc")}
          >
            <option value="desc">Recientes</option>
            <option value="asc">Antiguas</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b text-muted-foreground font-medium">
              <tr>
                <th className="p-4">ID Venta</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Método</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Monto</th>
                <th className="p-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-red-600" />
                    Cargando ventas...
                  </td>
                </tr>
              ) : ventasProcesadas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No se encontraron ventas con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                ventasProcesadas.map((v: any) => {
                  const emailCliente = v.emailClienteCasual || v.usuario?.email || v.cliente?.email || "Cliente presencial"

                  return (
                    <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-mono text-xs text-muted-foreground">{v.id}</td>
                      
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-foreground text-xs">
                            {emailCliente}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          {v.metodoPago === "efectivo" || v.tipo === "efectivo" ? (
                            <Banknote className="w-4 h-4 text-green-600" />
                          ) : (
                            <CreditCard className="w-4 h-4 text-blue-600" />
                          )}
                          {v.metodoPago || v.tipo || "MercadoPago"}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {v.fecha ? new Date(v.fecha).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-4 font-bold text-foreground">
                        ${Number(v.monto || v.total || 0).toLocaleString("es-AR")}
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                          Aprobado
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t bg-muted/10">
          <span className="text-xs text-muted-foreground">Página {page}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || loading}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={ventas.length < limit || loading}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Siguiente <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}