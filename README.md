# Create & Fabricate LLC — Website

Sitio web completo con sistema de reviews conectado a Supabase.

## Archivos del proyecto

```
createfabricate/
├── index.html          # Página principal (mobile-first)
├── review.html         # Formulario de reviews con estrellas
├── vercel.json         # Configuración de Vercel
├── .env.example        # Plantilla de variables de entorno
├── supabase_setup.sql  # Script SQL para crear la tabla en Supabase
└── README.md
```

---

## 🗄️ PASO 1 — Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta (es gratis)
2. Crea un **New Project** (anota la contraseña, la necesitarás)
3. Una vez creado, ve a **SQL Editor** en el menú izquierdo
4. Pega el contenido de `supabase_setup.sql` y haz clic en **Run**
5. Ve a **Settings → API** y copia:
   - `Project URL` → es tu `SUPABASE_URL`
   - `anon public` key → es tu `SUPABASE_ANON_KEY`

---

## 🌐 PASO 2 — Conectar las credenciales al HTML

Abre `index.html` y `review.html`. Busca la línea:

```js
const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';
```

**Para pruebas locales**, reemplaza con tus credenciales directamente:

```js
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...tu_anon_key';
```

**Para producción en Vercel** (más seguro), ve al paso 3 y usa las variables de entorno.

---

## 🚀 PASO 3 — Desplegar en Vercel

### Opción A — Subir los archivos directamente (más fácil)

1. Ve a [vercel.com](https://vercel.com) → **Add New Project**
2. Selecciona **"Deploy from file upload"** o arrastra la carpeta
3. Vercel detectará el `vercel.json` automáticamente
4. Haz clic en **Deploy** ✅

### Opción B — GitHub (recomendado para actualizaciones)

1. Sube los archivos a un repositorio en GitHub
2. Ve a [vercel.com](https://vercel.com) → **Add New Project** → **Import Git Repository**
3. Selecciona tu repo
4. Haz clic en **Deploy** ✅

### Variables de entorno en Vercel (para producción)

Después de hacer deploy:
1. Ve a tu proyecto en Vercel → **Settings → Environment Variables**
2. Agrega:
   - `SUPABASE_URL` = `https://tu-proyecto.supabase.co`
   - `SUPABASE_ANON_KEY` = `eyJhbGci...`
3. Haz un **Redeploy**

> **Nota:** Como el sitio es HTML estático, las variables de entorno de Vercel
> no se inyectan automáticamente en el JS del navegador. Por eso en este proyecto
> las credenciales van directo en el JS (el `anon key` de Supabase es seguro
> exponer al público — las políticas RLS protegen los datos).

---

## ⭐ PASO 4 — Sistema de reviews

Los clientes envían reviews desde `review.html`. Estas se publican **automáticamente** en tiempo real en la sección de Reviews del sitio, sin necesidad de aprobación.

El link para compartir por WhatsApp o Instagram después de cada evento:

```
https://tu-dominio.vercel.app/review.html
```

---

## 📧 Contacto

- info@createfabricate.com
- Instagram: @createfabricate
- Tel: 786 427-4966 / 786 655-1264
