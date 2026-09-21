# 🍎 Una Cosita de Zacatlán - Plataforma de Reservas Directas

Plataforma web de reservaciones directas y landing page para el complejo turístico **"Una Cosita de Zacatlán"** (cabañas de montaña, hotel boutique y restaurante en Zacatlán de las Manzanas, Puebla).

---

## 🛠️ Stack Tecnológico

- **Backend**: .NET 8 Web API (Clean Architecture: Domain, Application, Infrastructure, Api), Entity Framework Core (PostgreSQL / In-Memory), Swagger / OpenAPI v1.
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS (Paleta Rústico-Moderna).
- **Contenedores**: Docker Compose (PostgreSQL 16 + pgAdmin 4).

---

## 🚀 Guía de Inicio Rápido (Desarrollo Local)

### 1. Base de Datos (Docker Compose)
```bash
docker compose up -d
```
* **PostgreSQL**: `localhost:5432` (DB: `zacatlan_db`, User: `zacatlan_admin`)
* **pgAdmin**: `http://localhost:5050` (Email: `admin@unacositadezacatlan.com`, Pass: `AdminZacatlan2026!`)

---

### 2. Backend (.NET 8 API)
```bash
cd src/backend
dotnet run --project CositadeZacatlan.Api
```
* **Swagger UI**: [http://localhost:5247/swagger](http://localhost:5247/swagger) o `https://localhost:7198/swagger`

#### Endpoints Principales v1:
- `GET /api/v1/accommodations`: Catálogo de cabañas y suites.
- `GET /api/v1/accommodations/{slug}`: Detalle de hospedaje por slug.
- `POST /api/v1/bookings/hold`: Crear apartado temporal (TTL de 15 min).
- `POST /api/v1/bookings/confirm-whatsapp`: Confirmar y redirigir a enlace pre-llenado de WhatsApp.

---

### 3. Frontend (React + Vite + Tailwind CSS)
```bash
cd src/frontend
npm run dev
```
* **App Web**: [http://localhost:5173](http://localhost:5173)

---

## 🎨 Paleta de Colores Rústico-Moderna
- **Bosque / Pino (`forest`)**: `#1E3A2B` (Dark), `#2D5A40` (Primary)
- **Madera / Arcilla (`wood` / `terracotta`)**: `#8B4513`, `#C86D51`
- **Niebla / Piedra (`stone`)**: `#F4F6F0` (Light), `#2C302E` (Charcoal)
- **Cálido / Sol (`warm-gold`)**: `#DAA520`
