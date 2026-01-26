'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout';
import { Card, Button, Input, Modal } from '@/components/ui';
import { agendaApi, Activity } from '@/services/api';

export default function Agenda() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    activity_type: '',
    description: '',
    activity_date: '',
  });
  const userId = 1;

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await agendaApi.getAll(userId);
      setActivities(response.data);
    } catch (error) {
      console.log('Error loading activities');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newActivity.activity_type || !newActivity.activity_date) return;
    try {
      await agendaApi.create(userId, {
        activity_type: newActivity.activity_type,
        description: newActivity.description,
        activity_date: new Date(newActivity.activity_date).toISOString(),
      });
      setNewActivity({ activity_type: '', description: '', activity_date: '' });
      setIsModalOpen(false);
      loadActivities();
    } catch (error) {
      console.error('Error creating activity');
    }
  };

  const handleDelete = async (activityId: number) => {
    try {
      await agendaApi.delete(userId, activityId);
      loadActivities();
    } catch (error) {
      console.error('Error deleting activity');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Agenda</h1>
          <Button onClick={() => setIsModalOpen(true)}>Nueva Actividad</Button>
        </div>

        {loading ? (
          <p className="text-gray-600">Cargando...</p>
        ) : (
          <div className="grid gap-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <Card key={activity.id} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">{activity.activity_type}</h3>
                    {activity.description && (
                      <p className="text-gray-600">{activity.description}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {new Date(activity.activity_date).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(activity.id)}>
                    Eliminar
                  </Button>
                </Card>
              ))
            ) : (
              <Card>
                <p className="text-gray-500 text-center">No hay actividades programadas</p>
              </Card>
            )}
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Actividad">
          <div className="space-y-4">
            <Input
              label="Tipo de Actividad"
              placeholder="Ej: Reunion, Cita, Tarea"
              value={newActivity.activity_type}
              onChange={(e) => setNewActivity({ ...newActivity, activity_type: e.target.value })}
            />
            <Input
              label="Descripcion"
              placeholder="Descripcion opcional"
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
            />
            <Input
              label="Fecha y Hora"
              type="datetime-local"
              value={newActivity.activity_date}
              onChange={(e) => setNewActivity({ ...newActivity, activity_date: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Crear</Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}
