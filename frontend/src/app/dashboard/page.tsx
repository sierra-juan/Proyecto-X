'use client';

import { useState, useEffect } from 'react';
import { Sidebar, BottomNav } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { summaryApi, Summary, reminderApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  // New reminder state
  const [newReminderText, setNewReminderText] = useState('');
  const [reminderDate, setReminderDate] = useState(new Date().toISOString().split('T')[0]);
  const [reminderTime, setReminderTime] = useState('12:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadSummary(user.id);
    }
  }, [user, authLoading, router]);

  const loadSummary = async (userId: string | number) => {
    try {
      const response = await summaryApi.get(userId);
      setSummary(response.data);
    } catch (error) {
      console.log('No summary data yet');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderText.trim() || !user) return;

    setIsSubmitting(true);
    try {
      // Normalize time: Some browsers might return HH:mm or HH:mm a.m./p.m.
      let normalizedTime = reminderTime;
      if (normalizedTime.includes(' ')) {
        const [time, period] = normalizedTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period.toLowerCase().includes('p') && hours < 12) hours += 12;
        if (period.toLowerCase().includes('a') && hours === 12) hours = 0;
        normalizedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }

      const dateStr = `${reminderDate}T${normalizedTime}`;
      const reminderDateTime = new Date(dateStr);

      if (isNaN(reminderDateTime.getTime())) {
        throw new Error('Fecha o hora inválida. Por favor usa el formato estándar.');
      }

      await reminderApi.create(user.id, {
        text: newReminderText,
        reminder_time: reminderDateTime.toISOString()
      });
      setNewReminderText('');
      // Refresh summary
      await loadSummary(user.id);
    } catch (error: any) {
      console.error('Error creating reminder:', error);
      alert(`Error: ${error.message || 'No se pudo crear el recordatorio'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = async (reminderId: number, status: string) => {
    if (!user) return;
    try {
      await reminderApi.update(user.id, reminderId, {
        last_reaction_status: status,
        completed: status === 'completed'
      });
      // Refresh summary
      await loadSummary(user.id);
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white selection:bg-teal-500/30">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-zinc-400 mt-2 font-medium">Bienvenido de vuelta, <span className="text-teal-400">{user?.user_metadata?.full_name || user?.email}</span></p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center space-x-3 text-teal-500 font-medium animate-pulse">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg tracking-wide uppercase text-xs">Sincronizando...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
              {[
                { label: 'Total', val: summary?.total_reminders || 0, icon: '📝', color: 'border-teal-500/30' },
                { label: 'Hechos', val: summary?.completed_reminders || 0, icon: '✅', color: 'border-emerald-500/30' },
                { label: 'Pendientes', val: summary?.pending_reminders || 0, icon: '⏳', color: 'border-amber-500/30' },
                { label: 'Acts.', val: summary?.total_activities || 0, icon: '🏃', color: 'border-indigo-500/30' }
              ].map((stat, i) => (
                <div key={i} className={`glass-card p-5 border-l-2 ${stat.color} hover:bg-zinc-800/40 transition-all duration-300`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                      <div className="text-3xl font-bold text-zinc-100 mt-1">{stat.val}</div>
                    </div>
                    <div className="text-2xl opacity-80">{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                <div className="glass-card p-1">
                  <div className="p-6 bg-zinc-900/40 border-b border-white/5">
                    <h2 className="text-xl font-bold flex items-center">
                      <span className="mr-3">✨</span> Nuevo Recordatorio
                    </h2>
                  </div>
                  <form onSubmit={handleCreateReminder} className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="¿Qué quieres recordar? (ej: Caminar 20 min)"
                          className="w-full p-4 bg-zinc-950/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 outline-none transition-all placeholder:text-zinc-600 text-zinc-100 shadow-inner"
                          value={newReminderText}
                          onChange={(e) => setNewReminderText(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Fecha de la Tarea</label>
                          <input
                            type="date"
                            className="w-full p-4 bg-zinc-950/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500/50 outline-none text-zinc-100 shadow-inner color-scheme-dark"
                            value={reminderDate}
                            onChange={(e) => setReminderDate(e.target.value)}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Hora de Notificación</label>
                          <input
                            type="time"
                            className="w-full p-4 bg-zinc-950/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500/50 outline-none text-zinc-100 shadow-inner [color-scheme:dark]"
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || !newReminderText.trim()}
                        className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-[#0f172a] font-bold rounded-2xl shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                      >
                        {isSubmitting ? 'Procesando...' : 'Programar Actividad'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="glass-card">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center">
                      <span className="mr-3">🕒</span> Recordatorios Recientes
                    </h2>
                    <span className="text-[10px] font-bold bg-white/5 px-3 py-1 rounded-full text-zinc-400">EN CURSO</span>
                  </div>
                  <div className="p-6">
                    {summary?.recent_reminders && summary.recent_reminders.length > 0 ? (
                      <ul className="space-y-4">
                        {summary.recent_reminders.map((reminder) => (
                          <li
                            key={reminder.id}
                            className="flex flex-col p-5 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/[0.08] hover:border-white/10 transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`w-3 h-3 rounded-full ${reminder.completed ? 'bg-zinc-600' : 'bg-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.6)] animate-pulse'}`}></div>
                                <div>
                                  <span className={`block text-lg ${reminder.completed ? 'line-through text-zinc-500' : 'text-zinc-100 font-semibold'}`}>
                                    {reminder.text}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                                    {new Date(reminder.reminder_time).toLocaleDateString()} @ {new Date(reminder.reminder_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {!reminder.completed && (
                              <div className="flex space-x-3 mt-5 justify-end md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                <button
                                  onClick={() => handleReaction(reminder.id, 'completed')}
                                  className="text-xs px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-emerald-950 font-bold transition-all"
                                >
                                  Hecho
                                </button>
                                <button
                                  onClick={() => handleReaction(reminder.id, 'snoozed')}
                                  className="text-xs px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl hover:bg-amber-500 hover:text-amber-950 font-bold transition-all"
                                >
                                  +20m
                                </button>
                                <button
                                  onClick={() => handleReaction(reminder.id, 'ignored')}
                                  className="text-xs px-4 py-2 bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 rounded-xl hover:bg-zinc-500 hover:text-zinc-100 font-bold transition-all"
                                >
                                  Ignorar
                                </button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-5xl mb-4 opacity-20 text-teal-400">🛸</div>
                        <p className="text-zinc-500 font-medium">Todo bajo control</p>
                        <p className="text-xs text-zinc-600 mt-1 uppercase tracking-widest">No hay tareas pendientes</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="glass-card">
                  <div className="p-6 border-b border-white/5">
                    <h2 className="text-xl font-bold flex items-center">
                      <span className="mr-3">🔥</span> Actividades
                    </h2>
                  </div>
                  <div className="p-6">
                    {summary?.recent_activities && summary.recent_activities.length > 0 ? (
                      <ul className="space-y-5">
                        {summary.recent_activities.map((activity) => (
                          <li
                            key={activity.id}
                            className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/5"
                          >
                            <div className="bg-teal-500/20 p-3 rounded-2xl text-xl border border-teal-500/20">
                              {activity.activity_type === 'workout' ? '💪' : '🏃'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-zinc-200 capitalize">{activity.activity_type.replace('_', ' ')}</p>
                              <p className="text-[10px] text-zinc-500 uppercase font-bold mt-0.5">
                                {new Date(activity.activity_date).toLocaleDateString()}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-zinc-600 text-center py-8 text-xs uppercase font-bold tracking-widest">Sin registros recientes</p>
                    )}
                  </div>
                </div>

                <div className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-indigo-800 opacity-90 transition-all duration-700 group-hover:scale-110"></div>
                  <div className="relative p-8 text-white glass-accent border-none rounded-[32px]">
                    <h3 className="text-2xl font-black mb-3 flex items-center">
                      <span className="mr-3">🧠</span> AI INSIGHTS
                    </h3>
                    <p className="text-teal-50/70 text-sm leading-relaxed font-medium">
                      Analizando tus patrones... Tonalli AI está aprendiendo de tus ráfagas de productividad.
                    </p>
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-teal-200">
                        <span>Readiness</span>
                        <span>42%</span>
                      </div>
                      <div className="w-full bg-black/20 rounded-full h-2 mt-3 p-1">
                        <div className="bg-gradient-to-r from-teal-300 to-white rounded-full h-full w-[42%] shadow-[0_0_15px_rgba(45,212,191,0.8)] transition-all duration-1000"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
