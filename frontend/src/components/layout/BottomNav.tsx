'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/dashboard', label: 'Inicio', icon: '📊' },
    { href: '/agenda', label: 'Agenda', icon: '📅' },
    { href: '/settings', label: 'Ajustes', icon: '⚙️' },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass backdrop-blur-3xl border-t border-white/5 py-3 px-6 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center space-y-1 transition-all duration-300 ${pathname === item.href ? 'text-teal-400 scale-110' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
                </Link>
            ))}
        </nav>
    );
}
