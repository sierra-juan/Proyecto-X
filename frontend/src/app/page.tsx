'use client';

import Link from 'next/link';
import { Button, Card } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-teal-500/30 overflow-x-hidden">
      {/* Decorative Gradients */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600 rounded-full blur-[100px]"></div>
      </div>

      <nav className="relative z-10 glass border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center text-zinc-100 mb-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(45,212,191,0.5)] font-bold">
              𝕏
            </div>
            <span className="text-xl font-black tracking-tighter text-white">Tonalli AI</span>
          </div>
          <Link href="/dashboard">
            <button className="px-6 py-2.5 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-all text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Dashboard
            </button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-xs font-black uppercase tracking-widest mb-8 animate-pulse">
            <span>✨</span>
            <span>Inteligencia Artificial para tu Bienestar</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-10 bg-gradient-to-br from-white via-white to-zinc-500 bg-clip-text text-transparent">
            Domina tus hábitos, <br /> sin esfuerzo.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Gestiona tus recordatorios y actividades con un asistente que realmente aprende de ti. Integrado con Telegram para que nunca pierdas el ritmo.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard">
              <button className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-teal-500 to-emerald-600 text-[#0f172a] font-black rounded-2xl shadow-[0_0_40px_rgba(45,212,191,0.3)] hover:shadow-[0_0_60px_rgba(45,212,191,0.4)] hover:scale-105 active:scale-95 transition-all text-lg">
                Comenzar Ahora
              </button>
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-zinc-900 border border-white/5 text-zinc-400 font-bold rounded-2xl hover:bg-zinc-800 transition-all text-lg">
              Sobre el Proyecto
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: '📱', title: 'Telegram Bot', text: 'Interactúa con tu asistente en tiempo real desde la app que ya amas.' },
            { icon: '📊', title: 'Dashboard Premium', text: 'Visualiza tus avances con una interfaz minimalista y glassmorphism.' },
            { icon: '🔔', title: 'Contexto AI', text: 'Recordatorios inteligentes que consideran el clima y tu rendimiento.' }
          ].map((feat, i) => (
            <div key={i} className="glass-card group hover:bg-white/[0.05] transition-all p-1">
              <div className="p-8 bg-zinc-900/40 rounded-[23px]">
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">{feat.icon}</div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{feat.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-medium">
                  {feat.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-12 text-center text-zinc-600">
        <p className="text-xs font-black uppercase tracking-[0.3em]">Tonalli AI &copy; 2026</p>
      </footer>
    </div>
  );
}
