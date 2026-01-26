import os
import json
import random
from typing import Dict, Any
from backend.app.models.reminder import ReactionStatus
from openai import OpenAI

class ReminderIntelligence:
    """
    Servicio encargado de inyectar 'inteligencia' a los recordatorios basados en contexto
    utilizando OpenRouter.
    """
    
    _client = None

    @classmethod
    def get_client(cls):
        if cls._client is None:
            api_key = os.environ.get("OPENROUTER_API_KEY")
            cls._client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=api_key,
            )
        return cls._client

    @staticmethod
    async def get_dynamic_tone(streak_count: int, failure_count: int, reminder_text: str = "") -> str:
        """
        Determina el tono del mensaje según el desempeño del usuario usando LLM.
        """
        client = ReminderIntelligence.get_client()
        prompt = f"""
        Eres Tonalli AI, un asistente de bienestar. 
        Usuario: En racha de {streak_count} días, ha fallado {failure_count} veces recientemente.
        Actividad: {reminder_text}
        Genera un mensaje corto (máximo 150 caracteres) motivador o empático según el estado.
        Si la racha es alta, sé muy animado. Si ha fallado, sé comprensitivo pero impulsador.
        Responde SOLO con el mensaje, sin comillas ni explicaciones.
        """
        
        try:
            response = client.chat.completions.create(
                model="openai/gpt-3.5-turbo", # O un modelo ligero de OpenRouter
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error calling OpenRouter: {e}")
            # Fallback a lógica anterior
            if streak_count >= 5:
                return "¡Estás en racha! 🚀 Sigue así."
            return "Es hora de tu actividad programada. ⏰"

    @staticmethod
    async def evaluate_context(user_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analiza el contexto usando LLM para ajustar la urgencia o el mensaje.
        """
        client = ReminderIntelligence.get_client()
        prompt = f"""
        Analiza este contexto de usuario: {json.dumps(user_context)}
        Genera un consejo breve y determina la urgencia (alta o normal).
        Responde estrictamente en formato JSON: {{"advice": "mensaje", "urgency": "alta/normal"}}
        """
        
        try:
            response = client.chat.completions.create(
                model="openai/gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )
            return json.loads(response.choices[0].message.content)
        except Exception:
            return {
                "advice": "¡Tú puedes con esto! ⚡",
                "urgency": "normal"
            }
