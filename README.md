# C.E.P. Montserrat González — Academia de Peluquería y Barbería

Aplicación web full-stack: **Laravel 12 API REST** (backend) + **React/Vite SPA** (frontend).

> [!NOTE]
> **Documentación Completa**: Puedes encontrar toda la documentación de instalación, flujos de datos, endpoints y modelos en la carpeta [`/docs`](./docs).

---

## 🚀 Puesta en marcha

### Requisitos
- PHP 8.2+, Composer
- Node 18+, npm
- SQLite (o MySQL/PostgreSQL — ver `.env`)

### Backend
```bash
cd backend
cp .env.example .env          # configura DB_* si usas MySQL
composer install
php artisan key:generate
php artisan migrate --seed    # crea tablas + datos de ejemplo
php artisan serve             # http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

---

## 🔐 Credenciales Admin

| Campo    | Valor                  |
|----------|------------------------|
| Email    | `admin@academia.com`   |
| Password | `password`             |
| URL      | http://localhost:5173/admin |

---

## 🗺️ Rutas Frontend

### Públicas

| Ruta | Página |
|------|--------|
| `/` | Home |
| `/cursos` | Listado de cursos |
| `/cursos/barberia-peluqueria` | Barbería y Peluquería |
| `/cursos/certificados` | Certificados de profesionalidad |
| `/cursos/especialidades` | Especialidades |
| `/nuestros-alumnos` | Nuestros Alumnos |
| `/trabajos` | Nuestros Trabajos |
| `/testimonios` | Testimonios |
| `/bolsa-empleo` | Bolsa de Empleo |
| `/centros-colaboradores` | Centros Colaboradores |
| `/blog` | Blog |
| `/acceso-alumnos` | Área de Alumnos (placeholder) |
| `/contacto` | Contacto |

### Admin (requiere login en `/admin`)

| Ruta | Sección |
|------|---------|
| `/admin` | Login |
| `/admin/courses` | Gestión de Cursos |
| `/admin/testimonials` | Gestión de Testimonios |
| `/admin/blog` | Gestión del Blog |
| `/admin/jobs` | Bolsa de Empleo — Candidatos |
| `/admin/partners` | Centros Colaboradores |

---

## 🔌 API Endpoints

### Auth
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/login` | Login → devuelve token |
| `POST` | `/api/logout` | Logout (auth) |
| `GET` | `/api/me` | Usuario autenticado (auth) |

### Cursos
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/api/courses` | ❌ | Lista cursos (`?modality=presencial\|online`) |
| `GET` | `/api/courses/{id}` | ❌ | Detalle de curso |
| `POST` | `/api/admin/courses` | ✅ | Crear curso |
| `PUT` | `/api/admin/courses/{id}` | ✅ | Editar curso |
| `DELETE` | `/api/admin/courses/{id}` | ✅ | Eliminar curso |

### Testimonios
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/api/testimonials` | ❌ | Solo publicados |
| `GET/POST/PUT/DELETE` | `/api/admin/testimonials/{id?}` | ✅ | CRUD completo |
| `PATCH` | `/api/admin/testimonials/{id}/toggle` | ✅ | Publicar/Despublicar |

### Blog
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/api/blog/posts` | ❌ | Publicados, paginado 15/p. `?search=kw` |
| `GET` | `/api/blog/posts/{slug}` | ❌ | Post por slug |
| `GET/POST/PUT/DELETE` | `/api/admin/blog/posts/{id?}` | ✅ | CRUD completo |

### Bolsa de Empleo (Candidatos)
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/api/jobs/candidates` | ❌ | Visibles, paginado 12/p. `?search=kw` |
| `GET` | `/api/jobs/candidates/{slug}` | ❌ | Candidato por slug |
| `GET/POST/PUT/DELETE` | `/api/admin/jobs/candidates/{id?}` | ✅ | CRUD completo |

### Centros Colaboradores
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/api/partners` | ❌ | Solo visibles |
| `GET` | `/api/partners/{slug}` | ❌ | Partner por slug |
| `GET/POST/PUT/DELETE` | `/api/admin/partners/{id?}` | ✅ | CRUD completo |

### Otros (existentes)
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/api/services` | ❌ | Servicios |
| `GET` | `/api/gallery` | ❌ | Galería |
| `GET` | `/api/team` | ❌ | Equipo |
| `POST` | `/api/contact` | ❌ | Formulario de contacto |

---

## 🗃️ Datos de ejemplo (seeders)

| Seeder | Datos |
|--------|-------|
| `AdminUserSeeder` | 1 usuario admin |
| `CourseSeeder` | 8 cursos (presencial + online) |
| `TestimonialSeeder` | 8 testimonios (7 publicados, 1 borrador) |
| `BlogPostSeeder` | 5 posts (4 publicados, 1 borrador) |
| `CandidateSeeder` | 6 candidatos — bolsa empleo |
| `PartnerSeeder` | 5 centros colaboradores |

Para reiniciar con datos frescos:
```bash
php artisan migrate:fresh --seed
```

---

## 🏗️ Arquitectura

```
academia-peluqueria/
├── backend/          # Laravel 12 — API REST pura
│   ├── app/Models/
│   ├── app/Http/Controllers/Api/
│   │   └── Admin/   # Controladores admin (auth:sanctum)
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
│
└── frontend/         # React 18 + Vite + Bootstrap 5
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   │   ├── Layout.jsx      # Navbar + Footer
    │   │   ├── AdminShell.jsx  # Guard + nav admin
    │   │   └── CourseListPage.jsx
    │   └── hooks/
    │       └── useFetch.js
    └── public/assets/ # Imágenes del diseño original
```
