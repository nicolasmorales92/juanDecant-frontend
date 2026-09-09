"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api/auth"
import { useFormik } from "formik"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import z from "zod"
import { useStateAuth } from "@/hooks/useAuth"
import { JwtPayload } from "@/lib/interfaces/usuario/jwtDecode"
import { jwtDecode } from "jwt-decode"

const loginSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(1, { message: "La contraseña es requerida" })
})

export default function Login() {
    const router = useRouter()
    const { login: loginZustand } = useStateAuth()

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validate: (values) => {
            const result = loginSchema.safeParse(values);
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
        onSubmit: async (dataLogin) => {
            try {
                const data = await authApi.login(dataLogin);
                console.log("Respuesta real del backend:", data)
                const token = data.token || data.access_token;
                if (!token) {
                    throw new Error("No se recibió el token de autenticación");
                }

                const decoded = jwtDecode<JwtPayload>(token);
                const usuario = {
                    email: dataLogin.email,
                    nombre: "Usuario",
                    role: decoded.rol 
                };
                loginZustand(token, usuario);

                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: `Qué bueno verte otra vez.`,
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

                const userRole = usuario.role
                if (userRole === "admin" || userRole === "Admin") {
                    console.log(userRole)
                    router.push("/admin/productos");
                } else {
                    router.push("/productos");
                }
            }
            catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un problema',
                    text: error.message || 'Error al intentar ingresar. Inténtelo más tarde.',
                    iconColor: '#ef4444',
                    buttonsStyling: false,
                    customClass: {
                        popup: 'rounded-xl border border-border bg-background text-foreground shadow-lg font-sans p-6',
                        title: 'text-xl font-bold tracking-tight text-foreground',
                        htmlContainer: 'text-sm text-muted-foreground mt-2',
                        confirmButton: 'w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md h-9 text-sm font-medium transition-colors cursor-pointer block text-center py-2'
                    }
                });
            }
        }
    })

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 bg-muted/20">
            <Card className="w-full max-w-md shadow-lg border-border">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Iniciar Sesión</CardTitle>
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
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-xs font-medium text-destructive">{formik.errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                <Link
                                    href="/auth/olvide-mi-password"
                                    className="text-xs text-muted-foreground hover:text-red-600 transition-colors hover:underline"
                                >
                                    ¿Olvidó su contraseña?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                {...formik.getFieldProps('password')}
                                className="focus-visible:ring-red-600"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-xs font-medium text-destructive">{formik.errors.password}</p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="mt-2 flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                        >
                            Ingresar
                        </Button>

                        <p className="text-sm text-center text-muted-foreground">
                            ¿No tenés cuenta?{" "}
                            <Link
                                href="/auth/registro"
                                className="font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors"
                            >
                                Crear cuenta
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}