"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Swal from "sweetalert2"
import { productosApi } from "@/lib/api/productos"
import { Productos } from "@/lib/interfaces/productos/producto"

type CriterioOrden = "ninguno" | "precio-asc" | "precio-desc" | "stock-asc" | "stock-desc" | "genero-asc" | "genero-desc"

export default function AdminProductosPage() {
  const [busqueda, setBusqueda] = useState("")
  const [productos, setProductos] = useState<Productos[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [paginaActual, setPaginaActual] = useState(1)
  const limitePorPagina = 15

  const [orden, setOrden] = useState<CriterioOrden>("ninguno")

  const obtenerProductos = async () => {
    try {
      setCargando(true)
      setError(null)
      const res = await productosApi.obtenerProductos({ page: paginaActual, limit: limitePorPagina })
      const lista = Array.isArray(res) ? res : (res as any)?.data || []
      setProductos(lista)
    } catch (err) {
      console.error("Error al cargar productos:", err)
      setError("Error al cargar la lista de productos.")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    obtenerProductos()
  }, [paginaActual])

  const handleCrearProducto = () => {
    Swal.fire({
      title: "Nuevo Producto",
      html: `
      <div style="display: flex; flex-direction: column; gap: 12px; text-align: left; font-size: 14px;">
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Nombre del producto *</label>
          <input id="swal-nombre" class="swal2-input" placeholder="Ej: Bleu de Chanel" style="width: 100%; margin: 0;">
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Marca *</label>
          <input id="swal-marca" class="swal2-input" placeholder="Ej: Chanel" style="width: 100%; margin: 0;">
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Descripción *</label>
          <input id="swal-descripcion" class="swal2-input" placeholder="Ej: Aroma a café y chocolate" style="width: 100%; margin: 0;">
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Mililitros *</label>
          <input id="swal-mililitros" class="swal2-input" placeholder="Ej: 5" style="width: 100%; margin: 0;">
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Precio *</label>
          <input id="swal-precio" class="swal2-input" placeholder="Ej: 15000" style="width: 100%; margin: 0;">
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Stock *</label>
          <input id="swal-stock" class="swal2-input" placeholder="Ej: 10" style="width: 100%; margin: 0;">
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Género *</label>
          <select id="swal-genero" class="swal2-select" style="width: 100%; margin: 0; padding: 10px; border-radius: 6px; border: 1px solid #d1d5db;">
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Imagen del producto</label>
          <input id="swal-imagen" type="file" accept="image/*" class="swal2-file" style="width: 100%; margin: 0; padding: 6px;">
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Crear Producto",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-xl",
      },
      preConfirm: () => {
        const nombre = (document.getElementById("swal-nombre") as HTMLInputElement).value.trim()
        const marca = (document.getElementById("swal-marca") as HTMLInputElement).value.trim()
        const genero = (document.getElementById("swal-genero") as HTMLSelectElement).value
        const descripcion = (document.getElementById("swal-descripcion") as HTMLInputElement).value.trim()
        const mililitros = (document.getElementById("swal-mililitros") as HTMLInputElement).value.trim()
        const stock = (document.getElementById("swal-stock") as HTMLInputElement).value.trim()
        const precio = (document.getElementById("swal-precio") as HTMLInputElement).value.trim()
        const fileInput = document.getElementById("swal-imagen") as HTMLInputElement
        const imagen = fileInput.files ? fileInput.files[0] : null

        if (!nombre || !marca || !mililitros || !stock || !precio) {
          Swal.showValidationMessage("Por favor completá los campos obligatorios (*)")
          return false
        }

        const precioNum = Number(precio)
        const stockNum = Number(stock)

        if (isNaN(precioNum) || precioNum < 1) {
          Swal.showValidationMessage("El precio debe ser un número válido")
          return false
        }

        if (isNaN(stockNum) || stockNum < 1) {
          Swal.showValidationMessage("El stock debe ser un número entero válido")
          return false
        }

        const formData = new FormData()
        formData.append("nombre", nombre)
        formData.append("marca", marca)
        formData.append("genero", genero)
        formData.append("descripcion", descripcion)
        formData.append("variantes[0][mililitros]", mililitros)
        formData.append("variantes[0][precio]", precioNum.toString())
        formData.append("variantes[0][stock]", stockNum.toString())

        if (imagen) {
          formData.append("imagen", imagen)
        }

        return formData
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          Swal.fire({
            title: "Guardando producto...",
            text: "Subiendo datos e imagen al servidor",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
          })

          await productosApi.crearProductos(result.value)

          Swal.fire({
            title: "¡Creado!",
            text: "El producto se ha creado con éxito.",
            icon: "success",
            confirmButtonColor: "#dc2626",
            timer: 2000,
            timerProgressBar: true
          })

          obtenerProductos()
        } catch (err: any) {
          Swal.fire({
            title: "Error",
            text: err.message || "No se pudo crear el producto.",
            icon: "error",
            confirmButtonColor: "#dc2626",
          })
        }
      }
    })
  }




  const handleEditarProducto = (productoId: string) => {
    const productoActual = productos.find((p) => p.id === productoId)
    if (!productoActual) return

    const generoActual = productoActual.genero?.toLowerCase() || "unisex"

    const varianteActual = productoActual.variantes && productoActual.variantes.length > 0
      ? productoActual.variantes[0]
      : null

    const mililitrosActual = varianteActual?.mililitros || ""
    const precioActual = varianteActual?.precio ?? ""
    const stockActual = varianteActual?.stock ?? ""

    Swal.fire({
      title: "Editar Producto",
      html: `
      <div style="display: flex; flex-direction: column; gap: 12px; text-align: left; font-size: 14px;">
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Nombre del producto *</label>
          <input id="swal-edit-nombre" class="swal2-input" value="${productoActual.nombre || ""}" style="width: 100%; margin: 0;">
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Marca *</label>
          <input id="swal-edit-marca" class="swal2-input" value="${productoActual.marca || ""}" style="width: 100%; margin: 0;">
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Descripción</label>
          <input id="swal-edit-descripcion" class="swal2-input" value="${productoActual.descripcion || ""}" style="width: 100%; margin: 0;">
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Mililitros *</label>
          <input id="swal-edit-mililitros" class="swal2-input" value="${mililitrosActual}" placeholder="Ej: 5" style="width: 100%; margin: 0;">
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Precio *</label>
          <input id="swal-edit-precio" class="swal2-input" type="number" value="${precioActual}" placeholder="Ej: 15000" style="width: 100%; margin: 0;">
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Stock *</label>
          <input id="swal-edit-stock" class="swal2-input" type="number" value="${stockActual}" placeholder="Ej: 10" style="width: 100%; margin: 0;">
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">Género *</label>
          <select id="swal-edit-genero" class="swal2-select" style="width: 100%; margin: 0; padding: 10px; border-radius: 6px; border: 1px solid #d1d5db;">
            <option value="hombre" ${generoActual === "hombre" ? "selected" : ""}>Hombre</option>
            <option value="mujer" ${generoActual === "mujer" ? "selected" : ""}>Mujer</option>
            <option value="unisex" ${generoActual === "unisex" ? "selected" : ""}>Unisex</option>
          </select>
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar Cambios",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-xl",
      },


      preConfirm: () => {
        const nombre = (document.getElementById("swal-edit-nombre") as HTMLInputElement).value.trim()
        const marca = (document.getElementById("swal-edit-marca") as HTMLInputElement).value.trim()
        const descripcion = (document.getElementById("swal-edit-descripcion") as HTMLInputElement).value.trim()
        const mililitrosVal = (document.getElementById("swal-edit-mililitros") as HTMLInputElement).value.trim()
        const precioVal = (document.getElementById("swal-edit-precio") as HTMLInputElement).value.trim()
        const stockVal = (document.getElementById("swal-edit-stock") as HTMLInputElement).value.trim()
        const genero = (document.getElementById("swal-edit-genero") as HTMLSelectElement).value

        if (!nombre || !marca || !mililitrosVal || !precioVal || !stockVal) {
          Swal.showValidationMessage("Por favor completá los campos obligatorios (*)")
          return false
        }

        const precio = Number(precioVal)
        const stock = Number(stockVal)

        if (isNaN(precio) || precio < 1) {
          Swal.showValidationMessage("El precio debe ser un número válido")
          return false
        }

        if (isNaN(stock) || stock < 0) {
          Swal.showValidationMessage("El stock debe ser un número entero válido")
          return false
        }

        return {
          nombre,
          marca,
          descripcion,
          genero,
          variantes: [
            {
              mililitros: mililitrosVal,
              precio,
              stock,
            }
          ]
        }
      }


    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          Swal.fire({
            title: "Actualizando...",
            text: "Guardando cambios en el servidor",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
          })

          await productosApi.actualizar(productoId, result.value)

          Swal.fire({
            title: "¡Actualizado!",
            text: "El producto se ha modificado correctamente.",
            icon: "success",
            confirmButtonColor: "#dc2626",
            timer: 2000,
            timerProgressBar: true
          })

          obtenerProductos()
        } catch (err: any) {
          console.error("Error al actualizar producto:", err)
          Swal.fire({
            title: "Error de Validación",
            text: err.message || "No se pudo actualizar el producto.",
            icon: "error",
            confirmButtonColor: "#dc2626",
          })
        }
      }
    })
  }




  const handleEliminarProducto = (productoId: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer y eliminará el producto del catálogo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl",
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Eliminando...",
            text: "Aguardá un momento por favor",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
          })

          await productosApi.eliminar(productoId)

          Swal.fire({
            title: "¡Eliminado!",
            text: "El producto ha sido eliminado correctamente.",
            icon: "success",
            confirmButtonColor: "#dc2626",
            timer: 2000,
            timerProgressBar: true
          })

          obtenerProductos()
        } catch (err: any) {
          console.error("Error al eliminar producto:", err)
          Swal.fire({
            title: "Error",
            text: err.response?.data?.message || err.message || "No se pudo eliminar el producto.",
            icon: "error",
            confirmButtonColor: "#dc2626",
          })
        }
      }
    })
  }

  const alternarOrden = (criterioAsc: CriterioOrden, criterioDesc: CriterioOrden) => {
    if (orden === criterioAsc) {
      setOrden(criterioDesc)
    } else {
      setOrden(criterioAsc)
    }
  }

  const productosFiltrados = productos.filter((p) => {
    const termino = busqueda.toLowerCase()
    const nombre = p.nombre?.toLowerCase() || ""
    const marca = p.marca?.toLowerCase() || ""
    return nombre.includes(termino) || marca.includes(termino)
  })

  const filasVariantes = productosFiltrados.flatMap((prod) => {
    if (!prod.variantes || prod.variantes.length === 0) {
      return [{
        key: `${prod.id}-sin-variante`,
        productoId: prod.id,
        nombre: prod.nombre,
        marca: prod.marca,
        genero: (prod as any).genero || "Unisex",
        medida: "-",
        precio: 0,
        stock: 0,
      }]
    }

    return prod.variantes.map((v, index) => ({
      key: `${prod.id}-${v.id || index}`,
      productoId: prod.id,
      nombre: prod.nombre,
      marca: prod.marca,
      genero: prod.genero,
      medida: `${v.mililitros}ml`,
      precio: v.precio ?? 0,
      stock: v.stock ?? 0,
    }))
  })

  const filasProcesadas = [...filasVariantes].sort((a, b) => {
    if (orden === "ninguno") return 0

    switch (orden) {
      case "precio-asc":
        return a.precio - b.precio
      case "precio-desc":
        return b.precio - a.precio
      case "stock-asc":
        return a.stock - b.stock
      case "stock-desc":
        return b.stock - a.stock
      case "genero-asc":
        return a.genero.localeCompare(b.genero)
      case "genero-desc":
        return b.genero.localeCompare(a.genero)
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Productos</h2>
          <p className="text-muted-foreground text-sm">
            Administrá el catálogo, los decants y los niveles de stock.
          </p>
        </div>

        <Button
          onClick={handleCrearProducto}
          className="bg-red-600 hover:bg-red-700 text-white gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nuevo Producto
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o marca..."
            className="pl-8"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {cargando ? (
            <div className="p-8 text-center text-muted-foreground font-medium">
              Cargando productos...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 font-medium">
              {error}
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b text-muted-foreground font-medium select-none">
                <tr>
                  <th className="p-4">Producto</th>
                  <th className="p-4">Marca</th>
                  <th className="p-4">Medida</th>

                  <th className="p-4">
                    <button
                      onClick={() => alternarOrden("genero-asc", "genero-desc")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors font-medium cursor-pointer"
                    >
                      Género <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>

                  <th className="p-4">
                    <button
                      onClick={() => alternarOrden("precio-asc", "precio-desc")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors font-medium cursor-pointer"
                    >
                      Precio <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>

                  <th className="p-4">
                    <button
                      onClick={() => alternarOrden("stock-asc", "stock-desc")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors font-medium cursor-pointer"
                    >
                      Stock <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>

                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filasProcesadas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-muted-foreground">
                      No se encontraron productos.
                    </td>
                  </tr>
                ) : (
                  filasProcesadas.map((item) => (
                    <tr key={item.key} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-semibold text-foreground">{item.nombre}</td>
                      <td className="p-4 text-muted-foreground">{item.marca}</td>
                      <td className="p-4">
                        <span className="text-xs bg-muted px-2 py-1 rounded-md border font-semibold">
                          {item.medida}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs bg-muted/60 px-2 py-1 rounded-md border font-medium capitalize">
                          {item.genero}
                        </span>
                      </td>
                      <td className="p-4 font-medium">
                        ${item.precio.toLocaleString("es-AR")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${item.stock > 5
                            ? "bg-emerald-100 text-emerald-800"
                            : item.stock > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          {item.stock} un.
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEditarProducto(item.productoId)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEliminarProducto(item.productoId)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
          <span className="text-sm text-muted-foreground">
            Página <strong>{paginaActual}</strong>
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1 || cargando}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaginaActual((prev) => prev + 1)}
              disabled={productos.length < limitePorPagina || cargando}
            >
              Siguiente <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}