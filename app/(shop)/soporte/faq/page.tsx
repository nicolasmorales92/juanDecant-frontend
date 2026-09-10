'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    preguntas: '¿Los perfumes son 100% originales?',
    respuestas: 'Sí, todos nuestros perfumes y decants provienen de frascos originales adquiridos con distribuidores oficiales.'
  },
  {
    preguntas: '¿De qué tamaño son los perfumes?',
    respuestas: 'Los perfumes vienen solamente en frasco de 2,5ml y 5ml.'
  },
  {
    preguntas: '¿Cuánto tiempo dura un envío?',
    respuestas: 'Los envíos tardan máximo 3 días(Se coordinan directamente desde la App.'
  },
  {
    preguntas: '¿Qué medios de pago aceptan?',
    respuestas: 'Por el momento solo Mercado Pago hy efectivo.'
  }
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Preguntas Frecuentes</h1>
        <p className="text-gray-500 mt-2 text-sm">Resolvemos tus dudas sobre nuestros productos y servicios.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center p-5 text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <span className="text-base">{faq.preguntas}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {isOpen && (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.respuestas}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}