"use client"

import { useEffect, useState } from "react"
import { User, Mail, MapPin, Building, Home, Shield, Save, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStateAuth } from "@/hooks/useAuth"
import { usuariosApi } from "@/lib/api/usuarios"
import Swal from "sweetalert2"

export function PerfilForm() {
  const { token } = useStateAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    provincia: "",
    ciudad: "",
    calle: "",
  })
  const [rol, setRol] = useState("")

  useEffect(() => {
    if (!token) return

    const cargarPerfil = async () => {
      try {
        setLoading(true)
        const data = await usuariosApi.obtenerMiPerfil(token)
        setFormData({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          email: data.email || "",
          provincia: data.provincia || "",
          ciudad: data.ciudad || "",
          calle: data.calle || "",
        })
        setRol(data.rol || "USUARIO")
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error de carga",
          text: error.message || "No se pudieron obtener los datos de tu perfil",
        })
      } finally {
        setLoading(false)
      }
    }

    cargarPerfil()
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      setSaving(true)
      await usuariosApi.actualizarMiPerfil(token, formData)
      Swal.fire({
        icon: "success",
        title: "¡Perfil actualizado!",
        text: "Tus datos se guardaron correctamente.",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: error.message || "No se pudieron guardar los cambios",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mi Perfil</h2>
        <p className="text-muted-foreground text-sm">
          Consultá y actualizá tu información personal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Información Personal</h3>
                <p className="text-xs text-muted-foreground">Tus datos identificatorios</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
              <Shield className="w-3 h-3 text-red-600" /> Rol: {rol}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none" />
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="pl-9" required />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Dirección de Envío / Ubicación</h3>
              <p className="text-xs text-muted-foreground">Utilizado para tus compras y facturación</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provincia">Provincia</Label>
              <Input id="provincia" name="provincia" value={formData.provincia} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <div className="relative flex items-center">
                <Building className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none" />
                <Input id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} className="pl-9" />
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="calle">Dirección</Label>
              <div className="relative flex items-center">
                <Home className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none" />
                <Input id="calle" name="calle" value={formData.calle} onChange={handleChange} className="pl-9" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto px-8" disabled={saving}>
            {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  )
}