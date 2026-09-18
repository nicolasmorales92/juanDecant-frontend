'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth'; // Ajustá la ruta según tu proyecto

// 1. Componente interno que consume el token de la URL
function ContenidoVerificacion() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [estado, setEstado] = useState<'cargando' | 'exito' | 'error'>('cargando');
  const [mensaje, setMensaje] = useState('Verificando tu correo electrónico...');

  useEffect(() => {
    if (!token) {
      setEstado('error');
      setMensaje('No se proporcionó ningún token de verificación.');
      return;
    }

    const verificar = async () => {
      try {
        const res = await authApi.confirmarEmail(token);
        setEstado('exito');
        setMensaje(res.message);
      } catch (err: any) {
        setEstado('error');
        setMensaje(err.message || 'Ocurrió un error inesperado.');
      }
    };

    verificar();
  }, [token]);

  return (
    <div style={{ padding: '30px', borderRadius: '10px', border: '1px solid #ccc', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
      {estado === 'cargando' && <p>{mensaje}</p>}

      {estado === 'exito' && (
        <>
          <h2 style={{ color: 'green' }}>¡Correo Verificado!</h2>
          <p>{mensaje}</p>
          <button 
            onClick={() => router.push('/login')} 
            style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Ir a Iniciar Sesión
          </button>
        </>
      )}

      {estado === 'error' && (
        <>
          <h2 style={{ color: 'red' }}>Error de Verificación</h2>
          <p>{mensaje}</p>
          <button 
            onClick={() => router.push('/login')} 
            style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Volver al inicio
          </button>
        </>
      )}
    </div>
  );
}

export default function VerificacionUsuarioPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontFamily: 'sans-serif' }}>
      <Suspense fallback={<p>Cargando verificación...</p>}>
        <ContenidoVerificacion />
      </Suspense>
    </div>
  );
}