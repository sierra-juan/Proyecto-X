'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/agenda', label: 'Agenda', icon: '📅' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <aside className="hidden md:flex w-72 bg-[#121214]/50 border-r border-white/5 backdrop-blur-2xl min-h-screen flex-col">
      <div className="p-10">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(45,212,191,0.5)]">
            𝕏
          </div>
          <span className="text-2xl font-black tracking-tighter text-white group-hover:text-teal-400 transition-colors">
            Tonalli AI
          </span>
        </Link>
      </div>
      <nav className="mt-4 flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-4 rounded-2xl transition-all duration-300 font-bold tracking-tight ${pathname === item.href
              ? 'bg-teal-500/10 text-teal-400 shadow-[inset_0_0_20px_rgba(45,212,191,0.1)]'
              : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
              }`}
          >
            <span className="text-xl mr-4 opacity-80">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-6">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-6 py-4 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all font-bold"
        >
          <span className="text-xl mr-4">🚪</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
