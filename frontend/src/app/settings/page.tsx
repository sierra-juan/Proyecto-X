'use client';

import { Sidebar } from '@/components/layout';
import { Card, Button, Input } from '@/components/ui';

export default function Settings() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Configuracion</h1>

        <div className="max-w-2xl space-y-6">
          <Card title="Perfil de Usuario">
            <div className="space-y-4">
              <Input label="Nombre" placeholder="Tu nombre" />
              <Input label="Email" type="email" placeholder="tu@email.com" />
              <Button>Guardar Cambios</Button>
            </div>
          </Card>

          <Card title="Conexion de Telegram">
            <p className="text-gray-600 mb-4">
              Conecta tu cuenta de Telegram para recibir notificaciones y usar el bot.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                1. Abre Telegram y busca el bot<br />
                2. Envia el comando /start<br />
                3. Tu cuenta se vinculara automaticamente
              </p>
            </div>
          </Card>

          <Card title="Notificaciones">
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded mr-3" defaultChecked />
                <span>Recordatorios por Telegram</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded mr-3" defaultChecked />
                <span>Resumen diario</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded mr-3" />
                <span>Notificaciones por email</span>
              </label>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
