"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFormik } from "formik"
import Swal from "sweetalert2"
import z from "zod"
import { useState, Suspense } from "react"
import { authApi } from "@/lib/api/auth"

const restaurarSchema = z.object({
  newPassword: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

function FormularioRestaurar() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const result = restaurarSchema.safeParse(values)
      if (!result.success) {
        const errors: Record<string, string> = {}
        result.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0].toString()] = issue.message
          }
        })
        return errors
      }
    },
    onSubmit: async (values) => {
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Token faltante',
          text: 'El enlace de recuperación no es válido o está incompleto.',
        })
        return
      }

      setIsLoading(true)
      try {
        await authApi.restaurarContraseña({
          token,
          newPassword: values.newPassword
        })

        await Swal.fire({
          icon: 'success',
          title: '¡Contraseña actualizada!',
          text: 'Tu contraseña se cambió con éxito. Ya podés iniciar sesión.',
          iconColor: '#dc2626',
          buttonsStyling: false,
          customClass: {
            popup: 'rounded-xl border border-border bg-background text-foreground shadow-lg font-sans p-6',
            title: 'text-xl font-bold tracking-tight text-foreground',
            htmlContainer: 'text-sm text-muted-foreground mt-2',
            confirmButton: 'w-full mt-4 bg-red-600 hover:bg-red-700 text-white rounded-md h-9 text-sm font-medium transition-colors cursor-pointer block text-center py-2'
          }
        })

        router.push("/auth/login")
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error al cambiar la contraseña',
          text: error.message || 'El enlace caducó o no es válido.',
          iconColor: '#ef4444',
          buttonsStyling: false,
          customClass: {
            popup: 'rounded-xl border border-border bg-background text-foreground shadow-lg font-sans p-6',
            title: 'text-xl font-bold tracking-tight text-foreground',
            htmlContainer: 'text-sm text-muted-foreground mt-2',
            confirmButton: 'w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md h-9 text-sm font-medium transition-colors cursor-pointer block text-center py-2'
          }
        })
      } finally {
        setIsLoading(false)
      }
    }
  })

  return (
    <Card className="w-full max-w-md shadow-lg border-border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Restablecer Contraseña</CardTitle>
        <p className="text-sm text-muted-foreground">
          Ingresá tu nueva clave para actualizar el acceso a tu cuenta.
        </p>
      </CardHeader>

      <form onSubmit={formik.handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              {...formik.getFieldProps("newPassword")}
              className="focus-visible:ring-red-600"
              disabled={isLoading}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-xs font-medium text-destructive">{formik.errors.newPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...formik.getFieldProps("confirmPassword")}
              className="focus-visible:ring-red-600"
              disabled={isLoading}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-xs font-medium text-destructive">{formik.errors.confirmPassword}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="mt-2">
          <Button
            type="submit"
            disabled={isLoading || !token}
            className="w-full bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Actualizando..." : "Cambiar contraseña"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function RestaurarPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 bg-muted/20">
      <Suspense fallback={<p>Cargando formulario...</p>}>
        <FormularioRestaurar />
      </Suspense>
    </div>
  )
}