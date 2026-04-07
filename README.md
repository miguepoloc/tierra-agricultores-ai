# Tierra de Agricultores AI — Monorepo

Proyecto oficial de la plataforma **Tierra de Agricultores**, integrando un asistente de Inteligencia Artificial para potenciar el comercio justo entre agricultores y consumidores.

## 🏗️ Arquitectura del Proyecto

Este repositorio utiliza una estructura de **Monorepo** para separar las responsabilidades de frontend y backend:

- **/backend**: API robusta construida con **FastAPI** (Python). Implementa una arquitectura hexagonal simplificada con soporte multi-modelo (Gemini, OpenAI, Claude, DeepSeek) y RAG basado en archivos Markdown.
- **/frontend**: Interfaz de usuario moderna y premium construida con **Next.js 14**, React y TypeScript. Enfocada en ofrecer una experiencia de chat fluida y atractiva.

---

## 🚀 Guía de Inicio Rápido

### 1. Requisitos Previos
- Python 3.10+
- Node.js 18+
- Docker Desktop (para servicios adicionales como MCP)

### 2. Configuración del Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
# Configura tu archivo .env con las API Keys necesarias
uvicorn main:app --reload
```

### 3. Configuración del Frontend
```bash
cd frontend
npm install
# Crea un archivo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
```

---

## 🛠️ Tecnologías Principales

- **Frontend**: Next.js, React, TypeScript, Vanilla CSS (Design Tokens).
- **Backend**: FastAPI, Pydantic v2, Python Dotenv.
- **IA**: Google Gemini, OpenAI, Anthropic Claude, DeepSeek.
- **Despliegue**: Optimizado para **Vercel**.

---

## 📖 Conocimiento del Asistente
El asistente utiliza el contenido de `backend/knowledge/` y `backend/skills/` para responder preguntas específicas sobre:
- Catálogo de productos (Ñame, Café, Cacao, etc.)
- Perfiles de agricultores asociados.
- Zonas de producción (Sierra Nevada, Ciénaga, Santa Marta).

---

© 2026 Tierra de Agricultores. Todos los derechos reservados.
