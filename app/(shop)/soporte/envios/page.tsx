import { Truck, MapPin, PackageCheck, Clock } from 'lucide-react';

export default function EnviosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Métodos de Envío</h1>
        <p className="text-gray-500 mt-2 text-sm">Información detallada sobre cómo hacemos llegar tu pedido.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="border border-gray-200 rounded-2xl p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 text-black">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">Envío a Domicilio</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Envios a todo Tigre, San Isidro, San Fernando, Vicente López y San Martin.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-700">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>1 a 3 días hábiles</span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 text-black">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">Punto de Encuentro</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Podés coordinar el punto de encuentro con el vendedor.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-700">
            <PackageCheck className="w-4 h-4 text-gray-400" />
            <span>1 a 3 días hábiles.</span>
          </div>
        </div>
      </div>

    </div>
  );
}