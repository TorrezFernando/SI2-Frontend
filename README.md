# SI2 Fronted — Inmobiliaria Raíces (Angular 17+)

Frontend Web empresarial y profesional desarrollado para el sistema inmobiliario **SI2 — Inmobiliaria Raíces** (SaaS Multi-tenant).

Este proyecto es **completamente independiente** del backend en FastAPI (`SI2-Backend`).

---

## 🛠️ Tecnologías Utilizadas

- **Angular 17+** (Standalone Components & Functional Guards / Interceptors)
- **TypeScript & RxJS**
- **HTML5 & SCSS Puro** (Sin Angular Material, Bootstrap ni Tailwind CSS)
- **Angular Router & Reactive Forms**
- **HttpClient API con JWT Interceptor**

---

## 🚀 Instalación y Ejecución

### Requisitos Previos
- **Node.js**: v18.0.0 o superior (Verificado con v24.x)
- **npm**: v9.0.0 o superior

### Pasos de Inicio
1. Abrir una terminal en el directorio del frontend:
   ```bash
   cd "c:\Users\Jorge\.gemini\antigravity\scratch\SI2-Frontend"
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo de Angular:
   ```bash
   npm start
   # O ejecute directamente:
   npx ng serve
   ```

4. Abrir en el navegador:
   [http://localhost:4200](http://localhost:4200)

---

## 🔗 Configuración de la API Backend

La conexión centralizada se encuentra en `src/app/core/config/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000'
};
```

---

## 🔐 Autenticación y Control de Acceso (RBAC / CBAC)

1. **JWT & Session**: Las peticiones incluyen automáticamente el encabezado `Authorization: Bearer <token>` gestionado por `auth.interceptor.ts`.
2. **Permisos Dinámicos**: El endpoint `GET /users/me` suministra el arreglo `permisos` del usuario autenticado.
3. **Menú Dinámico & Guards**: El sidebar se construye filtrando los módulos según el permiso asignado (`UI:MENU_CATALOGO`, `UI:MENU_ROLES`, `UI:MENU_BITACORA`, etc.), y las rutas son protegidas mediante `permission.guard.ts`.

---

## 📊 Clasificación de Módulos

### ✅ Integrados con Backend Real (`http://localhost:8000`)
- **Autenticación**: `POST /login`, `POST /register`, `POST /forgot-password`
- **Perfil & Seguridad**: `GET /users/me`, `PUT /users/me/password` (con validación de contraseña mediante Regex)
- **Catálogo Inmobiliario Público**: `GET /modulo_inmuebles/propiedades/catalogo` (con filtros de operación, rango de precios, EAV y `X-Tenant-ID`)
- **Roles & Permisos**: `GET /roles`, `POST /roles`, `PUT /roles/{id}/permisos`, `GET /permisos`, `POST /permisos`
- **Bitácora Cifrada**: `GET /admin/bitacora?dev_key={llave}` (Auditoría exclusiva SuperAdmin)

### ⏳ Módulos Preparados (Pendientes de Endpoints Backend)
- **Empresas SaaS** (`/dashboard/empresas`)
- **Gestión de Usuarios** (`/dashboard/usuarios`)
- **Propiedades CRUD Administrativo** (`/dashboard/propiedades`)
- **Clientes, Propietarios y Agentes** (`/dashboard/clientes`, `/dashboard/propietarios`, `/dashboard/agentes`)
- **Visitas, Contratos y Pagos** (`/dashboard/visitas`, `/dashboard/contratos`, `/dashboard/pagos`)

> ℹ️ *Estos módulos cuentan con vistas y tablas profesionales preparadas con avisos explicativos "Integración Backend Pendiente", sin realizar llamadas a endpoints inexistentes ni simular datos erróneos.*
