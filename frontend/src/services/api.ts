import axios from 'axios';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export interface User {
  id: string | number;
  telegram_id: string | null;
  name: string | null;
  email: string | null;
  created_at: string;
}

export interface Reminder {
  id: number;
  user_id: string | number;
  text: string;
  reminder_time: string;
  completed: boolean;
  last_reaction_status: string;
  context_metadata: any | null;
  created_at: string;
}

export interface Activity {
  id: number;
  user_id: string | number;
  activity_type: string;
  description: string | null;
  activity_date: string;
  reminder_id: number | null;
  metadata_info: any | null;
  created_at: string;
}

export interface Summary {
  total_reminders: number;
  completed_reminders: number;
  pending_reminders: number;
  total_activities: number;
  recent_activities: Activity[];
  recent_reminders: Reminder[];
}

export const userApi = {
  getAll: () => api.get<User[]>('/api/users'),
  getById: (id: string | number) => api.get<User>(`/api/users/${id}`),
  create: (data: Partial<User>) => api.post<User>('/api/users', data),
};

export const reminderApi = {
  getAll: (userId: string | number) => api.get<Reminder[]>(`/api/reminders/${userId}`),
  create: (userId: string | number, data: { text: string; reminder_time: string }) =>
    api.post<Reminder>(`/api/reminders/${userId}`, data),
  update: (userId: string | number, reminderId: number, data: Partial<Reminder>) =>
    api.put<Reminder>(`/api/reminders/${userId}/${reminderId}`, data),
  delete: (userId: string | number, reminderId: number) =>
    api.delete(`/api/reminders/${userId}/${reminderId}`),
};

export const agendaApi = {
  getAll: (userId: string | number) => api.get<Activity[]>(`/api/agenda/${userId}`),
  create: (userId: string | number, data: { activity_type: string; description?: string; activity_date: string }) =>
    api.post<Activity>(`/api/agenda/${userId}`, data),
  delete: (userId: string | number, activityId: number) =>
    api.delete(`/api/agenda/${userId}/${activityId}`),
};

export const summaryApi = {
  get: (userId: string | number) => api.get<Summary>(`/api/summary/${userId}`),
};

export default api;
