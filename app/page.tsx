'use client';

import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Wallet, CheckCircle2, ShieldCheck, Sparkles, BuildingStorefront, ArrowRightLeft, Heart } from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      // ⚠️ REEMPLAZA ESTA URL CON TU ENDPOINT DE FORMSPREE
      const response = await fetch('https://formspree.io/f/TU_FORM_ID_AQUI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fecha: new Date().toISOString() }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Vercel Analytics mide las visitas automáticamente */}
      <Analytics />

      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
            <Wallet className="w-6 h-6" />
          </div>
          <span>Finance<span className="text-indigo-600">Books</span></span>
        </div>
        <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full">
          Próximamente Beta Gratis
        </span>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-12 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-4 h-4" /> Finanzas sencillas para parejas e independientes
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-6">
          Finanzas en pareja, <br />
          <span className="text-indigo-600">sin discusiones ni planillas</span>
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          Lleven los ingresos y gastos del hogar en tiempo real. Cuentas claras y metas juntas.
        </p>

        {/* Formulario con envío real */}
        <div className="max-w-md mx-auto">
          {status === 'success' ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 flex items-center justify-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ¡Listo! Te guardamos un cupo para el acceso anticipado.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {status === 'loading' ? 'Guardando...' : 'Acceso Anticipado'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="text-xs text-rose-500 mt-2">Ocurrió un error. Intenta de nuevo.</p>
          )}
          <p className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Sin spam. Te avisaremos solo al abrir cupos.
          </p>
        </div>
      </section>

      {/* --- MOCKUP ILUSTRATIVO --- */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-indigo-600 rounded-3xl p-8 text-white text-center shadow-xl">
          <h3 className="text-xl font-bold mb-4">Un solo lugar para ambos</h3>
          <div className="bg-white text-slate-800 rounded-2xl p-6 max-w-sm mx-auto shadow-md">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="font-bold flex items-center gap-1">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Hogar & Pareja
              </span>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">Compartido</span>
            </div>
            <div className="py-4">
              <p className="text-xs text-slate-400">Balance disponible</p>
              <p className="text-3xl font-extrabold text-slate-900">$1,450.00</p>
            </div>
            <div className="space-y-2 text-xs text-left">
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span>Supermercado (Alex)</span>
                <span className="font-bold">-$85.00</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span>Pago de Luz (María)</span>
                <span className="font-bold">-$42.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- GANCHO NEGOCIO --- */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-semibold">
              Emprendedores & Independientes
            </span>
            <h2 className="text-2xl font-bold mt-3">¿Tienes un negocio?</h2>
            <p className="text-slate-300 text-sm mt-1">
              Separa las cuentas de tu emprendimiento y pásate tu sueldo al Libro del Hogar con 1 clic.
            </p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl text-center border border-slate-700">
            <ArrowRightLeft className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
            <span className="text-xs text-slate-300 font-medium">Gasto Negocio ➔ Ingreso Hogar</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} FinanceBooks. Todos los derechos reservados.
      </footer>
    </div>
  );
}