'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import {
  Wallet,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRightLeft,
  Heart,
  XCircle,
  Eye,
  Rocket,
  Zap,
  RefreshCw,
  Mail,
} from 'lucide-react';

// ⚠️ REEMPLAZA ESTO CON TU MEASUREMENT ID DE GOOGLE ANALYTICS 4 (formato: G-XXXXXXXXXX)
const GA_MEASUREMENT_ID = 'G-MSD5VC5FT3';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Envía un evento a Google Analytics 4 (no falla si gtag aún no cargó)
function gtagEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent, formSource: 'hero' | 'cierre') => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    gtagEvent('submit_attempt', { form: formSource });

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
        gtagEvent('email_submitted', { form: formSource });
      } else {
        setStatus('error');
        gtagEvent('submit_error', { form: formSource, reason: 'response_not_ok' });
      }
    } catch {
      setStatus('error');
      gtagEvent('submit_error', { form: formSource, reason: 'network_error' });
    }
  };

  // Trackea cuándo el usuario hace foco en el campo de correo (primer indicio de interés)
  const handleEmailFocus = (formSource: 'hero' | 'cierre') => {
    gtagEvent('email_focus', { form: formSource });
  };

  // Trackea cuándo el usuario ve cada sección clave del embudo (una sola vez por sección)
  const problemaRef = useRef<HTMLElement>(null);
  const solucionRef = useRef<HTMLElement>(null);
  const negocioRef = useRef<HTMLElement>(null);
  const cierreRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const seen = new Set<string>();
    const sections: { ref: React.RefObject<HTMLElement>; name: string }[] = [
      { ref: problemaRef, name: 'problema' },
      { ref: solucionRef, name: 'solucion' },
      { ref: negocioRef, name: 'negocio' },
      { ref: cierreRef, name: 'cierre' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = sections.find((s) => s.ref.current === entry.target);
            if (match && !seen.has(match.name)) {
              seen.add(match.name);
              gtagEvent('section_view', { section: match.name });
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => {
      if (s.ref.current) observer.observe(s.ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Google Analytics 4: carga el script y lo inicializa (mide pageviews automáticamente) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
          window.gtag = gtag;
        `}
      </Script>

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

      {/* --- HERO --- */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-4 h-4" /> Finanzas sencillas para parejas
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-6">
          Menos discusiones por dinero. <br />
          <span className="text-indigo-600">Más tranquilidad en pareja.</span>
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          Registren juntos los gastos del hogar en segundos desde sus celulares. Sepan exactamente en qué se va el dinero y eviten esos momentos incómodos de fin de mes.
        </p>

        {/* Formulario con envío real */}
        <div className="max-w-md mx-auto">
          {status === 'success' ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 flex items-center justify-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ¡Listo! Te guardamos un cupo para el acceso anticipado.
            </div>
          ) : (
            <form onSubmit={(e) => handleSubmit(e, 'hero')} className="flex flex-col gap-3">
              <label htmlFor="email-hero" className="text-sm font-medium text-slate-600 text-left flex items-center gap-1">
                <Mail className="w-4 h-4" /> Déjanos tu correo y te avisamos apenas abramos cupos
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="email-hero"
                  type="email"
                  required
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleEmailFocus('hero')}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {status === 'loading' ? 'Guardando...' : 'Obtener acceso anticipado gratis'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="text-xs text-rose-500 mt-2">Ocurrió un error. Intenta de nuevo.</p>
          )}
          <p className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Sin spam. Solo te avisamos cuando abramos los primeros cupos.
          </p>
        </div>
      </section>

      {/* --- EL PROBLEMA --- */}
      <section ref={problemaRef} className="max-w-4xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          "¿En qué se nos fue el dinero?"
        </h2>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-10">
          "Seguro gastamos de más… pero ¿en qué?"
        </h2>

        <div className="grid sm:grid-cols-3 gap-4 text-left">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <XCircle className="w-5 h-5 text-rose-500 mb-2" />
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Los gastos pequeños se pierden:</span> compras del día a día que nadie recuerda… hasta que falta dinero.
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <XCircle className="w-5 h-5 text-rose-500 mb-2" />
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Todo queda en el aire:</span> sin un registro claro, solo hay suposiciones.
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <XCircle className="w-5 h-5 text-rose-500 mb-2" />
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Aparecen tensiones innecesarias:</span> no es el dinero… es la falta de claridad.
            </p>
          </div>
        </div>
      </section>

      {/* --- LA SOLUCIÓN --- */}
      <section ref={solucionRef} className="max-w-4xl mx-auto px-6 pb-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-10">
          Una forma simple de tener todo claro, juntos.
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 text-left">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Registran gastos en segundos</h3>
            <p className="text-sm text-slate-600">
              Abres la app, anotas el gasto y listo. Sin complicaciones, sin excusas.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-3">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Todo sincronizado para ambos</h3>
            <p className="text-sm text-slate-600">
              Cada movimiento aparece al instante en los dos celulares. Siempre saben qué está pasando.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-3">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Claridad que evita discusiones</h3>
            <p className="text-sm text-slate-600">
              Cuando todo está visible, no hay dudas, ni suposiciones, ni conflictos.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Pensado para parejas que manejan el dinero como uno solo</h3>
            <p className="text-sm text-slate-600">
              Si el dinero es de ambos, esto está hecho exactamente para ustedes.
            </p>
          </div>
        </div>
      </section>

      {/* --- MOCKUP ILUSTRATIVO --- */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-indigo-600 rounded-3xl p-8 text-white text-center shadow-xl">
          <h3 className="text-xl font-bold mb-4">Un solo lugar para ambos</h3>
          <div className="bg-white text-slate-800 rounded-2xl p-6 max-w-sm mx-auto shadow-md">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="font-bold flex items-center gap-1">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Finanzas de pareja
              </span>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">Libro Compartido</span>
            </div>
            <div className="py-4">
              <p className="text-xs text-slate-400">Saldo disponible</p>
              <p className="text-3xl font-extrabold text-slate-900"> 1,327.00 PEN</p>
            </div>
            <div className="space-y-2 text-xs text-left">
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span>Sueldo (Alex)</span>
                <span className="font-bold "> 1500.00 PEN</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span>Supermercado (Alex)</span>
                <span className="font-bold text-red-400">- 85.00 PEN</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span>Pago de Luz (María)</span>
                <span className="font-bold text-red-400">- 42.00 PEN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- GANCHO NEGOCIO --- */}
      <section ref={negocioRef} className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-semibold">
              Emprendedores & Independientes
            </span>
            <h2 className="text-2xl font-bold mt-3">¿También tienen un ingreso independiente o negocio?</h2>
            <p className="text-slate-300 text-sm mt-1">
              Lleven un registro separado para el negocio y mantengan claro lo del hogar. Todo ordenado, sin mezclar números.
            </p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl text-center border border-slate-700">
            <ArrowRightLeft className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
            <span className="text-xs text-slate-300 font-medium">Gasto Negocio ➔ Ingreso Hogar</span>
          </div>
        </div>
      </section>

      {/* --- PRUEBA SOCIAL / CIERRE --- */}
      <section ref={cierreRef} className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm px-4 py-2 rounded-full mb-6">
          <Rocket className="w-4 h-4" /> Únete a la lista de espera
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
          Tu relación no debería complicarse por dinero.
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-10">
          Estamos construyendo la primera versión. Únete a la lista de espera y sé de los primeros en probarla gratis.
        </p>

        <div className="max-w-md mx-auto">
          {status === 'success' ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 flex items-center justify-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ¡Listo! Te guardamos un cupo para el acceso anticipado.
            </div>
          ) : (
            <form onSubmit={(e) => handleSubmit(e, 'cierre')} className="flex flex-col gap-3">
              <label htmlFor="email-cierre" className="text-sm font-medium text-slate-600 text-left flex items-center gap-1">
                <Mail className="w-4 h-4" /> Déjanos tu correo y te avisamos apenas abramos cupos
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="email-cierre"
                  type="email"
                  required
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleEmailFocus('cierre')}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {status === 'loading' ? 'Guardando...' : 'Quiero probarlo antes que nadie'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="text-xs text-rose-500 mt-2">Ocurrió un error. Intenta de nuevo.</p>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} FinanceBooks. Todos los derechos reservados.
      </footer>
    </div>
  );
}