"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProvinciasEnum } from "@/lib/enums/provincias.enum";
import { validarZodFormik } from "@/lib/helpers/formikValidateZod";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { authApi } from "@/lib/api/auth";
import { CiudadesPorProvincia } from "@/lib/enums/todasLasCiudades.enum";




const registroSchema = z.object({
    nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    apellido: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
        .string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
        .regex(/[^a-zA-Z0-9]/, { message: "Debe incluir al menos un símbolo especial (ej: !@#$%)" }),
    confirmarPassword: z.string().min(1, { message: "Confirma tu contraseña" }),
    provincia: z.string().min(1, { message: "Selecciona una provincia válida" }),
    ciudad: z.string().min(1, { message: "Selecciona una ciudad válida" }),
    calle: z
        .string()
        .min(3, { message: "La dirección es obligatoria" })
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚ\u00f1\u00d1.\s]+\s+\d+$/, {
            message: "Debe contener calle y altura (ej: Av. San Martin 435)",
        }),
})
    .refine((data) => data.password === data.confirmarPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmarPassword"],
    });

export default function Registro() {
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);
    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            nombre: "",
            apellido: "",
            email: "",
            password: "",
            confirmarPassword: "",
            provincia: "",
            ciudad: "",
            calle: "",
        },
        validate: validarZodFormik(registroSchema),
        onSubmit: async (dataForm) => {
            try {
                const { confirmarPassword, ...dataParaBackend } = dataForm;
                await authApi.registro(dataParaBackend);

                Swal.fire({
                    icon: 'success',
                    title: '¡Registro Exitoso!',
                    text: 'Tu usuario ha sido creado correctamente.',
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
                router.push("/auth/login");
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un problema',
                    text: error.message || 'No se pudo crear el usuario.',
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
        },
    });



    const ciudadesDisponibles = formik.values.provincia
        ? CiudadesPorProvincia[formik.values.provincia] || []
        : [];



    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 bg-muted/20">
            <Card className="w-full max-w-md shadow-lg border-border">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Crear Usuario</CardTitle>
                </CardHeader>

                <form onSubmit={formik.handleSubmit}>
                    <CardContent className="mb-2 space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="nombre">Nombre</Label>
                                <Input
                                    id="nombre"
                                    type="text"
                                    placeholder="Juan"
                                    {...formik.getFieldProps("nombre")}
                                    className="focus-visible:ring-red-600"
                                />
                                {formik.touched.nombre && formik.errors.nombre && (
                                    <p className="text-xs text-red-500 font-medium">{formik.errors.nombre}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="apellido">Apellido</Label>
                                <Input
                                    id="apellido"
                                    type="text"
                                    placeholder="Pérez"
                                    {...formik.getFieldProps("apellido")}
                                    className="focus-visible:ring-red-600"
                                />
                                {formik.touched.apellido && formik.errors.apellido && (
                                    <p className="text-xs text-red-500 font-medium">{formik.errors.apellido}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="juan@gmail.com"
                                {...formik.getFieldProps("email")}
                                className="focus-visible:ring-red-600"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-xs text-red-500 font-medium">{formik.errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={mostrarPassword ? "text" : "password"}
                                    {...formik.getFieldProps("password")}
                                    className="focus-visible:ring-red-600 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    tabIndex={-1}
                                >
                                    {mostrarPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-xs text-red-500 font-medium">{formik.errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="confirmarPassword">Confirmar Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="confirmarPassword"
                                    type={mostrarConfirmarPassword ? "text" : "password"}
                                    {...formik.getFieldProps("confirmarPassword")}
                                    className="focus-visible:ring-red-600 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    tabIndex={-1}
                                >
                                    {mostrarConfirmarPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {formik.touched.confirmarPassword && formik.errors.confirmarPassword && (
                                <p className="text-xs text-red-500 font-medium">{formik.errors.confirmarPassword}</p>
                            )}
                        </div>



                        <div className="space-y-1">
                            <Label htmlFor="provincia">Provincia</Label>
                            <select
                                id="provincia"
                                name="provincia"
                                value={formik.values.provincia}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    formik.setFieldValue("ciudad", "")
                                }}
                                onBlur={formik.handleBlur}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="" disabled hidden>Seleccioná una provincia</option>
                                {Object.values(ProvinciasEnum).map((prov) => (
                                    <option key={prov} value={prov}>
                                        {prov}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.provincia && formik.errors.provincia && (
                                <p className="text-xs text-red-500 font-medium">{formik.errors.provincia}</p>
                            )}
                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="ciudad">Ciudad</Label>
                                <select
                                    id="ciudad"
                                    {...formik.getFieldProps("ciudad")}
                                    disabled={!formik.values.provincia}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="" disabled hidden>Seleccioná una ciudad</option>
                                    {ciudadesDisponibles.map((barrio) => (
                                        <option key={barrio} value={barrio}>
                                            {barrio}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.ciudad && formik.errors.ciudad && (
                                    <p className="text-xs text-red-500 font-medium">{formik.errors.ciudad}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="calle">Calle</Label>
                                <Input
                                    id="calle"
                                    type="text"
                                    placeholder="Saenz Peña 123"
                                    {...formik.getFieldProps('calle')}
                                    className="focus-visible:ring-red-600"
                                />
                                {formik.touched.calle && formik.errors.calle && (
                                    <p className="text-xs text-red-500 font-medium">{formik.errors.calle}</p>
                                )}
                            </div>
                        </div>

                    </CardContent>

                    <CardFooter className="mt-6 flex flex-col space-y-3">
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer">
                            Registrate
                        </Button>

                        <p className="text-sm text-center text-muted-foreground">
                            ¿Ya tenés cuenta?{" "}
                            <Link href="/auth/login" className="font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors">
                                Iniciá sesión
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}