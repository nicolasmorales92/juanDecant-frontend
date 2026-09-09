'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { CheckCircle2 } from "lucide-react"; // Si no usas lucide-react, puedes usar SVG simples

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Home() {
  const banners = [
    {
      id: 1,
      type: "custom", 
    },
    {
      id: 2,
      type: "image",
      titulo: "Descubrí Tu Fragancia Ideal",
      subtitulo: "Perfumes importados premium seleccionados para resaltar tu esencia.",
      imagen: "https://res.cloudinary.com/domaokdib/image/upload/v1784952249/Foto_de_inicio_perfumes_mjiwm1.jpg",
      link: "/productos"
    },
    {
      id: 3,
      type: "image",
      titulo: "Lujo e Intensidad",
      subtitulo: "Colección para ellas.",
      imagen: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1600&auto=format&fit=crop",
      link: "/productos?genero=mujer"
    },
    {
      id: 4,
      type: "image",
      titulo: "Elegancia en Cada Detalle",
      subtitulo: "Colección para ellos.",
      imagen: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1600&auto=format&fit=crop",
      link: "/productos?genero=hombre"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 w-full my-8">
        <section className="w-full h-[60vh] md:h-[75vh] bg-muted/20 relative overflow-hidden">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="w-full h-full custom-home-swiper"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.id} className="w-full h-full">
                {banner.type === "custom" ? (

                  <div className="w-full h-full bg-[#121212] text-white flex items-center justify-center px-6 md:px-16">
                    <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      
                      <div className="md:col-span-5 flex justify-center">
                        <div className="relative border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl bg-black/40 p-2">
                          <img 
                            src="https://res.cloudinary.com/domaokdib/image/upload/v1788226343/dashboard_lgshg3.png" 
                            alt="Decants de perfume"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-7 flex flex-col justify-center space-y-4 text-left">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-zinc-100 leading-tight">
                          El Lujo de Explorar <span className="text-amber-400">Nuevas Fragancias</span>
                        </h2>

                        <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                          Nos destacamos por ofrecer perfumes originales de las mejores marcas internacionales en formatos fraccionados. La alternativa ideal para llevar y disfrutar tu aroma distintivo en cualquier momento y lugar.
                        </p>

                        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                          Nuestro objetivo es hacer que la alta perfumería sea accesible, permitiéndote armar una colección variada sin necesidad de invertir en frascos de gran tamaño ni precio.
                        </p>

                        <div className="pt-2 flex flex-wrap gap-4 text-xs md:text-sm font-medium text-zinc-200">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400">✓</span>
                            <span>100% Fragancias Originales</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400">✓</span>
                            <span>Formatos prácticos de 2.5ml y 5ml</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (

                  <div 
                    className="w-full h-full bg-cover bg-center relative select-none"
                    style={{ backgroundImage: `url(${banner.imagen})` }}
                  >
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 md:px-6">
                      <div className="max-w-3xl space-y-4 animate-fade-in">
                        {banner.titulo && (
                          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-md">
                            {banner.titulo}
                          </h1>
                        )}
                        {banner.subtitulo && (
                          <p className="text-sm sm:text-lg md:text-xl text-zinc-200 font-medium max-w-xl mx-auto drop-shadow">
                            {banner.subtitulo}
                          </p>
                        )}
                        {banner.link && (
                          <div className="pt-2">
                            <Button 
                              size="lg" 
                              asChild 
                              className="rounded-xl font-bold px-8 shadow-lg cursor-pointer transform hover:scale-105 transition-all bg-white text-black hover:bg-zinc-100"
                            >
                              <Link href={banner.link}>Ver Productos</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </main>
    </div>
  );
}