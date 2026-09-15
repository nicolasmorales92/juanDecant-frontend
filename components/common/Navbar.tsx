'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Sparkles, ShoppingBag, ShoppingCart, User, UserCheck, LogOut, Droplets } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStateAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { usuario, estaAutenticado, logout } = useStateAuth();

  const handleCerrarSesion = () => {
    logout();
    router.push('/auth/login');
  };

  const esCarrito = pathname === '/carrito';
  const esMisCompras = pathname === '/mis-compras';

  const queryParam = searchParams.get('query') || '';
  const [busqueda, setBusqueda] = useState(queryParam);

  useEffect(() => {
    setBusqueda(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const esAuth = pathname.startsWith('/auth');
    const esSoporte = pathname.startsWith('/soporte');

    if (esCarrito || esMisCompras || esAuth || esSoporte) return;
    if (busqueda.trim() === queryParam) return;

    const timer = setTimeout(() => {
      const queryLimpia = busqueda.trim();
      const params = new URLSearchParams(searchParams.toString());

      if (queryLimpia) {
        params.set('query', queryLimpia);
      } else {
        params.delete('query');
      }

      const queryString = params.toString();
      const basePath = pathname.startsWith('/productos') ? pathname : '/productos';
      const targetUrl = queryString ? `${basePath}?${queryString}` : basePath;

      router.replace(targetUrl, { scroll: false });
    }, 500); 

    return () => clearTimeout(timer);
  }, [busqueda, pathname, queryParam, searchParams, router, esCarrito, esMisCompras]);

  return (
    <div className="w-full bg-background border-b border-border sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col gap-2.5 md:gap-0 md:h-16 md:flex-row md:items-center md:justify-between">
        
        <div className="flex items-center justify-between gap-4 w-full md:w-auto">
          <div className="font-bold text-xl tracking-tight shrink-0">
            <Link href="/">Juan Parfum</Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:hidden">
            <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/productos">
                <Droplets className="h-4 w-4 text-amber-500" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/mis-compras">
                <ShoppingBag className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/carrito">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full border border-border h-8 w-8 ml-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {estaAutenticado ? usuario?.nombre : 'Bienvenido'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {estaAutenticado ? usuario?.email : 'Cuenta de usuario'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {estaAutenticado ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/mi-perfil" className="flex items-center w-full cursor-pointer">
                        <UserCheck className="mr-2 h-4 w-4" />
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleCerrarSesion}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/registro" className="flex items-center w-full cursor-pointer">
                        Registrate
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login" className="flex items-center w-full cursor-pointer">
                        Iniciar Sesión
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>


        <div className="hidden md:flex items-center gap-2 md:gap-4">
          <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
            <Link href="/productos">
                <Droplets className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Productos</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground relative" title="Mis Compras">
            <Link href="/mis-compras">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Mis Compras</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground relative" title="Carrito de compras">
            <Link href="/carrito">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>

          <span className="h-6 bg-border" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full border border-border">
                <User className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {estaAutenticado ? usuario?.nombre : 'Bienvenido'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {estaAutenticado ? usuario?.email : 'Cuenta de usuario'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {estaAutenticado ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/mi-perfil" className="flex items-center w-full cursor-pointer">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleCerrarSesion}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/registro" className="flex items-center w-full cursor-pointer">
                      Registrate
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login" className="flex items-center w-full cursor-pointer">
                      Iniciar Sesión
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </nav>
    </div>
  );
}