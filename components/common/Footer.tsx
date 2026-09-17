'use client' 

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border text-muted-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-5 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

        <div className="space-y-3">
          <h3 className="font-bold text-foreground text-lg">Juan Parfum</h3>
          <p className="text-sm">
            Fragancias de perfumería árabe, nicho y diseñador.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">Tienda</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/productos" className="hover:text-foreground transition-colors">
                Todos los productos
              </Link>
            </li>
            <li>
              <Link href="/productos?genero=hombre" className="hover:text-foreground transition-colors">
                Fragancias Masculinas
              </Link>
            </li>
            <li>
              <Link href="/productos?genero=mujer" className="hover:text-foreground transition-colors">
                Fragancias Femeninas
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">Soporte</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/soporte/faq" className="hover:text-foreground transition-colors">Preguntas Frecuentes</Link>
            </li>
            <li>
              <Link href="/soporte/envios" className="hover:text-foreground transition-colors">Métodos de Envío</Link>
            </li>
            <li>
              <Link href="/soporte/contacto" className="hover:text-foreground transition-colors">Contacto</Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="w-full border-t border-border py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} Nicolás Morales. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}