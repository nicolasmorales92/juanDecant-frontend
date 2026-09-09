"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFormik } from "formik"
import Swal from "sweetalert2"
import Link from "next/link"
import z from "zod"
import { useState } from "react"
import { authApi } from "@/lib/api/auth"

const recuperarSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
})

export default function RecuperarPassword() {
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate: (values) => {
      const result = recuperarSchema.safeParse(values);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0].toString()] = issue.message;
          }
        });
        return errors;
      }
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const data = await authApi.olvideMiContraseña(values.email)


        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: data.message || 'Si el correo está registrado, recibirás un enlace.',
          iconColor: '#dc2626',
          buttonsStyling: false,
          customClass: {
            popup: 'rounded-xl border border-border bg-background text-foreground shadow-lg font-sans p-6',
            title: 'text-xl font-bold tracking-tight text-foreground',
            htmlContainer: 'text-sm text-muted-foreground mt-2',
            confirmButton: 'w-full mt-4 bg-red-600 hover:bg-red-700 text-white rounded-md h-9 text-sm font-medium transition-colors cursor-pointer block text-center py-2'
          }
        });

        formik.resetForm();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Hubo un problema',
          text: 'No pudimos procesar la solicitud. Inténtalo más tarde.',
          iconColor: '#ef4444',
          buttonsStyling: false,
          customClass: {
            popup: 'rounded-xl border border-border bg-background text-foreground shadow-lg font-sans p-6',
            title: 'text-xl font-bold tracking-tight text-foreground',
            htmlContainer: 'text-sm text-muted-foreground mt-2',
            confirmButton: 'w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md h-9 text-sm font-medium transition-colors cursor-pointer block text-center py-2'
          }
        });
      } finally {
        setIsLoading(false);
      }
    }
  })

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 bg-muted/20">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Recuperar Contraseña</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ingresá tu email y te enviaremos un enlace para restablecer tu acceso.
          </p>
        </CardHeader>

        <form onSubmit={formik.handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@gmail.com"
                {...formik.getFieldProps("email")}
                className="focus-visible:ring-red-600"
                disabled={isLoading}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs font-medium text-destructive">{formik.errors.email}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="mt-2 flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Enviando..." : "Enviar enlace"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              ¿Recordaste tu contraseña?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors"
              >
                Volver al login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}