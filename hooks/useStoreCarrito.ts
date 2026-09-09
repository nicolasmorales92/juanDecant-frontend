import { Productos} from '@/lib/interfaces/productos/producto';
import { Variantes } from '@/lib/interfaces/productos/variantes';
import { CarritoItems } from '@/lib/interfaces/productos/productosCarrito';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Carrito {
  carrito: CarritoItems[];
  agregarAlCarrito: (producto: Productos, varianteElegida: Variantes) => void;
  sumarAlCarrito: (cartItemId: string) => void;
  restarAlCarrito: (cartItemId: string) => void;
  calcularTotal: () => number;
}

export const useStoreCarrito = create<Carrito>()(
  persist(
    (set, get) => ({
      carrito: [],

      agregarAlCarrito: (producto, varianteElegida) =>
        set((state) => {
          // Identificador único para distinguir variantes del mismo perfume
          const cartItemId = `${producto.id}-${varianteElegida.id}`;

          const existe = state.carrito.find((item) => item.cartItemId === cartItemId);

          if (existe) {
            return {
              carrito: state.carrito.map((item) =>
                item.cartItemId === cartItemId
                  ? { ...item, cantidad: item.cantidad + 1 }
                  : item
              ),
            };
          }

          return {
            carrito: [
              ...state.carrito,
              {
                ...producto,
                cartItemId,
                varianteId: varianteElegida.id,
                precioSeleccionado: varianteElegida.precio,
                cantidad: 1,
              },
            ],
          };
        }),

      sumarAlCarrito: (cartItemId) =>
        set((state) => ({
          carrito: state.carrito.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          ),
        })),

      restarAlCarrito: (cartItemId) =>
        set((state) => ({
          carrito: state.carrito
            .map((item) =>
              item.cartItemId === cartItemId
                ? { ...item, cantidad: item.cantidad - 1 }
                : item
            )
            .filter((item) => item.cantidad > 0),
        })),

      calcularTotal: () => {
        return get().carrito.reduce(
          (acc, item) => acc + item.precioSeleccionado * item.cantidad,
          0
        );
      },
    }),
    {
      name: 'carrito-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);