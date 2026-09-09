'use client'

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, ShoppingBag, LogOut, User, Users } from "lucide-react";
import { useStateAuth } from "@/hooks/useAuth";
import Swal from "sweetalert2";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logout } = useStateAuth();

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tendrás que volver a ingresar para gestionar la tienda.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        router.push("/auth/login");
      }
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/40 font-sans">
      <aside className="hidden w-64 flex-col border-r bg-background md:flex h-full">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-2 py-2 border-b">
              <span className="font-extrabold text-xl text-primary font-serif">Vendedor</span>
            </div>

            <nav className="space-y-1">
              <Link
                href="/admin/mi-perfil"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <User className="w-4 h-4" />
                Mi perfil
              </Link>

              <Link
                href="/admin/usuarios"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Users className="w-4 h-4" />
                Usuarios
              </Link>

              <Link
                href="/admin/productos"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Package className="w-4 h-4" />
                Productos
              </Link>

              <Link
                href="/admin/ventas"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Ventas
              </Link>
              <Link
                href="/admin/detallesVenta"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Detalle de ventas
              </Link>
            </nav>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Área principal */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b bg-background px-6 shrink-0">
          <h1 className="text-sm font-semibold">Gestión de Tienda</h1>
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
            Vendedor
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}