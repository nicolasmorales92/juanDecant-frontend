import { Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6';

export default function ContactoPage() {
  const whatsappNumber = '5491136973905'; 
  const instagramUser = 'juanchi_kemmerer'; 
  const emailAddress = 'contacto@juanchi.com';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Contacto</h1>
        <p className="text-gray-500 mt-2 text-sm">¿Tenés alguna consulta? Ponete en contacto con nosotros por cualquiera de estos medios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-200 rounded-2xl p-5 bg-white flex items-center justify-between hover:border-gray-400 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <FaWhatsapp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">WhatsApp</p>
              <p className="font-bold text-gray-900 group-hover:underline">Escribinos directamente</p>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
        </a>

        <a
          href={`https://instagram.com/${instagramUser}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-200 rounded-2xl p-5 bg-white flex items-center justify-between hover:border-gray-400 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600">
              <FaInstagram className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Instagram</p>
              <p className="font-bold text-gray-900 group-hover:underline">@{instagramUser}</p>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
        </a>

        <a
          href={`mailto:${emailAddress}`}
          className="border border-gray-200 rounded-2xl p-5 bg-white flex items-center justify-between hover:border-gray-400 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-black">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Email</p>
              <p className="font-bold text-gray-900 group-hover:underline">{emailAddress}</p>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
        </a>


      </div>
    </div>
  );
}