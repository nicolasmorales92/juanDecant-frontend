"use client"

import { useState, useEffect } from "react"
import { RefreshCw, User, Mail, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStateAuth } from "@/hooks/useAuth"
import { usuariosApi } from "@/lib/api/usuarios"
import Swal from "sweetalert2"
import { UsuarioResponse } from "@/lib/interfaces/usuario/responseUsuario"

export default function UsuariosPage() {
  const { token } = useStateAuth()
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchEmail, setSearchEmail] = useState("")
  const limit = 10

  const cargarUsuarios = async () => {
    if (!token) return
    try {
      setLoading(true)
      const data = await usuariosApi.verUsuarios(token, page, limit)
      const lista = Array.isArray(data) ? data : (data as any)?.data || []
      setUsuarios(lista)
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar usuarios",
        text: error.message || "No se pudieron obtener los registros",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [page, token])

  const usuariosFiltrados = usuarios.filter((u) =>
    u.email.toLowerCase().includes(searchEmail.toLowerCase().trim())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Lista de usuarios</h2>
        </div>

        <div className="relative w-full sm:w-72">
          <Input
            type="text"
            placeholder="Buscar por email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="pl-9 text-sm focus-visible:ring-red-600 w-full"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b text-muted-foreground font-medium">
              <tr>
                <th className="p-4">Nombre y Apellido</th>
                <th className="p-4">Email</th>
                <th className="p-4">Ubicación</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr key="row-loading">
                  <td colSpan={3} className="p-8 text-center text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-red-600" />
                    Cargando usuarios...
                  </td>
                </tr>
              ) : usuariosFiltrados.length === 0 ? (
                <tr key="row-empty">
                  <td colSpan={3} className="p-8 text-center text-muted-foreground">
                    {searchEmail
                      ? `No se encontraron usuarios con el email "${searchEmail}"`
                      : "No hay usuarios registrados."}
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((u, index) => (
                  <tr key={u.id || u.email || index} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {`${u.nombre || ""} ${u.apellido || ""}`.trim() || "—"}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {u.email}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {u.cuidad || u.calle ? `${u.cuidad || ""}, ${u.calle || ""}` : "—"}
                    </td>
                  </tr>
                ))
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
              disabled={usuarios.length < limit || loading}
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