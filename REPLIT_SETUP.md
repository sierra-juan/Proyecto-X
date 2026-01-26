# Guía de Variables de Entorno - Replit

## ⚠️ CRÍTICO: Variables Requeridas

Estas variables **DEBEN** estar configuradas en Replit Secrets para que la aplicación funcione:

### 1. SUPABASE_JWT_SECRET
**Donde obtenerlo:**
1. Ve a tu proyecto en Supabase Dashboard
2. Settings → API → Project API keys
3. Busca la sección "JWT Secret" (al final)
4. Copia el valor completo

**Por qué es necesario:**
El backend lo usa para validar que los tokens de autenticación sean legítimos.

**Error si falta:**
```
Error: Request failed with status code 401
```

### 2. SUPABASE_URL
**Ejemplo:** `https://xxxxx.supabase.co`

**Donde obtenerlo:**
Settings → API → Project URL

### 3. SUPABASE_ANON_KEY
**Donde obtenerlo:**
Settings → API → Project API keys → `anon` `public`

### 4. DATABASE_URL
Automáticamente configurado por Replit si usas Postgres integrado

## 🔧 Cómo Configurar en Replit

1. Abre tu proyecto en Replit
2. Click en "Tools" (🔧) en el panel izquierdo
3. Selecciona "Secrets"
4. Para cada variable:
   - Key: nombre de la variable (ej: `SUPABASE_JWT_SECRET`)
   - Value: el valor real
   - Click "Add new secret"

## ✅ Verificar Configuración

Después de agregar los secrets:
1. Click en "Republish" o "Deploy"
2. Si algo falta, el backend mostrará un error claro en los logs

## Variables Opcionales

### OPENROUTER_API_KEY
Solo si quieres funcionalidades de IA avanzadas

### TELEGRAM_BOT_TOKEN
Solo si vas a usar el bot de Telegram
