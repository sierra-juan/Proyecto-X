# Reporte: Sistema de Recordatorios Tonalli AI

Este reporte analiza el estado actual de los sistemas de recordatorios en aplicaciones líderes de fitness y bienestar, identificando áreas de oportunidad para que Tonalli AI se destaque mediante una "reacción inteligente" y una estructura de datos que permita el seguimiento a largo plazo.

## 1. Comparativa de Mercado

| Aplicación | Enfoque | Lo que hacen bien | Lo que falta / Quejas comunes |
| :--- | :--- | :--- | :--- |
| **MyFitnessPal** | Nutrición / Logging | Recordatorios consistentes por comida. | Demasiado rígidos; se vuelven "ruido" fácilmente. |
| **Strava** | Social / GPS | Gamificación y retos. Notificaciones de logros de amigos. | Recordatorios de actividad genéricos, poco personalizados al estado físico del día. |
| **Whoop** | Fisiológico / Recovery | Sugerencias basadas en datos reales (sueño, HRV). | Solo funciona con su hardware; enfoque muy técnico. |
| **Streaks** | Hábitos (Minimalismo) | Interfaz limpia y enfoque en la racha (momentum). | Falta de inteligencia contextual; no sabe *por qué* no cumpliste. |

## 2. Análisis de Reviews y Psicología del Usuario

De acuerdo con la investigación de mercado y psicología del comportamiento, los usuarios valoran:
- **Intencionalidad:** Los recordatorios que "enseñan" o aportan valor son más efectivos que los que solo "empujan".
- **Reducción de Fricción:** Poder registrar una actividad directamente desde la notificación.
- **Evitar la "Ceguera de Notificación":** Cuando los mensajes son siempre iguales, el cerebro los ignora.

## 3. Puntos de Mejora: El Concepto de "Reacción"

Para Tonalli AI, la "reacción" del recordatorio no debe ser solo un mensaje, sino un flujo inteligente:

### A. Reacción Contextual y Adaptativa
En lugar de un horario fijo, el sistema debería reaccionar a:
- **Disponibilidad:** Si el calendario está libre o si el usuario ha estado sedentario por más de 2 horas.
- **Tono Dinámico:** Si el usuario está en una racha de 5 días, usar tono motivador. Si ha fallado 3 días, usar tono empático o preguntar si necesita ayuda para ajustar la meta.
- **Predicción de Deserción:** Usar IA para detectar patrones que preceden al abandono del hábito y enviar un recordatorio "especial" para rescatar la consistencia.

### B. Notificaciones Ejecutables (Quick Actions)
Toda reacción de recordatorio debe permitir una acción inmediata:
- [Log de Agua] - Botón de "+250ml"
- [Log de Entrenamiento] - Botón de "Iniciar Rutina" o "Marcar como hecho"
- [Pospuesto Inteligente] - "Recuérdame en 20 min" (basado en el tiempo promedio que el usuario tarda en reaccionar).

## 4. Implementación para Record de Actividades

Para que esta información sea útil en el futuro (Machine Learning y Análisis de Progreso), cada interacción con un recordatorio debe guardarse como un objeto de datos estructurado:

```json
{
  "timestamp": "2026-01-25T10:00:00Z",
  "reminder_type": "workout_reminder",
  "trigger_source": "sedentary_alert_2h",
  "user_response": "delayed", 
  "context": {
    "weather": "sunny",
    "previous_night_sleep_quality": "high",
    "current_streak": 4
  }
}
```

**Beneficios de esta estructura:**
1. **Personalización Predictiva:** Tonalli AI aprenderá que "los lunes por la mañana el usuario ignora los recordatorios si durmió mal".
2. **Auditoría de Hábitos:** Permitirá generar reportes de "por qué" fallan los hábitos, no solo "cuántas" veces fallaron.

---
> [!IMPORTANT]
> **Sugerencia de Implementación:** No tocar el código actual hasta definir los esquemas de base de datos que soporten el objeto de contexto mencionado arriba. Esto asegurará que Tonalli AI sea genuinamente inteligente desde la base.
