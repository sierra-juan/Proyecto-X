'use client';

import { supabase } from '@/lib/supabase';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && !loading) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;

    return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 selection:bg-teal-500/30">
            <Card className="max-w-md w-full p-10 glass-card">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-[0_0_25px_rgba(45,212,191,0.4)]">
                        𝕏
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2">Tonalli AI</h1>
                    <p className="text-zinc-400 font-medium">Eleva tus hábitos con inteligencia</p>
                </div>

                <div className="space-y-6">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-4 flex items-center justify-center space-x-3 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-2xl transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span>Entrar con Google</span>
                    </button>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
                            <span className="px-4 bg-[#121214]">MÉTODOS SEGUROS</span>
                        </div>
                    </div>

                    <button
                        disabled
                        className="w-full py-4 bg-zinc-900 text-zinc-600 font-bold rounded-2xl cursor-not-allowed opacity-40 border border-white/5"
                    >
                        Correo (Próximamente)
                    </button>
                </div>

                <p className="text-[10px] font-bold text-zinc-600 text-center mt-10 uppercase tracking-widest leading-loose">
                    Al continuar, aceptas nuestros <br /> <span className="text-zinc-500">términos y condiciones.</span>
                </p>

            </Card>
        </div>
    );
}
