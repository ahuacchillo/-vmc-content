# VMC Content HQ

App propia (Next.js) para la gestión de contenido de **@vmcsubastas** (SUBASTOP S.A.C.):
el plan de lanzamiento y el publicador de Instagram, en un solo lugar. Base para
conectar más adelante modelos de IA y distribución de contenido.

## Rutas

| Ruta | Qué es |
|---|---|
| `/` | Redirige a `/tablero` |
| `/tablero` | **Grilla de contenido VMC Subastas** — perfil editable (Nombre/Bio/CTA), la grilla del feed del sprint de lanzamiento (con fase, tipo y **pauta** por pieza) y el banco de slogans. |
| `/tablero/audit` | **Audit VMC** — qué suma / qué frena la marca, la lógica de cadencia y la gestión post-lanzamiento. |
| `/publicar` | **Publicador de Instagram** — subir imagen → caption → publicar en el feed. |

## Correr en local

```bash
npm install
cp .env.example .env      # Supabase (tablero compartido) + IG_*/PUBLIC_BASE_URL (solo /publicar)
npm run dev               # http://localhost:3000
```

> El tablero funciona sin configurar nada (cae a `localStorage`). Con las vars
> `NEXT_PUBLIC_SUPABASE_*` la edición se **comparte** entre dispositivos y personas.

## El tablero (`/tablero`)

Tres bloques editables, todos se guardan solos:

- **Perfil** — preview del perfil de IG (Nombre / Bio / CTA / enlace) tal como se ve en el celular.
- **Grilla del feed** — el sprint de lanzamiento (arranca el Vie 10; con prórroga opcional
  D+1/D+2, eliminable). Clic en una celda abre el modal de edición. Cada día tiene:
  - **Fase** (Despertar / Hype / Reveal / Lanzamiento) — la barra superior **filtra**; el tag se **cicla** al clic.
  - **Tipo** (Reel / Carrusel / Foto).
  - **Pauta** — objetivo de campaña que se **cicla**: Orgánico → Alcance → Tráfico → Conversión.
    Con pauta, la celda muestra un chip 📣 dorado + anillo (canal visual aparte de la fase).
    Las reglas de qué pieza lleva pauta están como nota sobre el perfil.
  - **Añadir día** y **✕** para los días añadidos (los del plan base van 🔒).
- **Slogans** — banco de opciones; **Copiar** al portapapeles, editar texto/etiqueta, añadir/eliminar.
- Piel del design system Concorde/VMC (paleta naranja→vault + teal, Plus Jakarta Sans).

> Persistencia: cada bloque es un documento `jsonb` en la tabla `docs` de Supabase
> (ver `supabase.sql`), con `localStorage` como caché/fallback. El campo de pauta viaja
> dentro del mismo `jsonb`, sin columnas extra.

## El publicador (`/publicar`)

Publica una imagen única en el feed por la Graph API. El token vive solo en el servidor.

Requisitos de Meta (una sola vez): cuenta de Instagram **Business/Creator** vinculada a una
Página de Facebook, una app en [Meta for Developers](https://developers.facebook.com/) con
**Instagram Graph API**, y **App Review** para `instagram_content_publish`. De ahí salen
`IG_USER_ID` e `IG_ACCESS_TOKEN` (larga duración, ~60 días — refresco pendiente).

> Instagram descarga la imagen desde `PUBLIC_BASE_URL`, que debe ser accesible por internet.
> En local: `ngrok http 3000` y pega la URL `https` en `PUBLIC_BASE_URL`.

## Cómo está armado

```
app/tablero/page.tsx        grilla de contenido (Profile + MatrixEditor + Copys)
app/tablero/MatrixEditor.tsx grilla del feed editable (fase, tipo, pauta)
app/tablero/Profile.tsx      preview editable del perfil de IG
app/tablero/Copys.tsx        banco de slogans
app/tablero/useStore.ts      persistencia: Supabase (docs jsonb) + localStorage
app/tablero/audit/page.tsx   Audit VMC
app/publicar/page.tsx        UI del publicador
app/api/upload/route.ts      guarda la imagen y devuelve su URL pública
app/api/publish/route.ts     lee el token del entorno y publica
lib/instagram.mjs            las 2 llamadas al Graph API (contenedor → publish). Testeable.
lib/supabase.ts              cliente del navegador (o null → localStorage)
supabase.sql                 esquema de la tabla `docs`
```

## Probar la lógica del publicador sin red

```bash
npm test        # self-check de publishImage con fetch falso
```

## Pendientes

- [ ] Persistencia compartida de la matriz (backend)
- [ ] Conexión con IA para generar/asistir contenido
- [ ] Programar publicaciones (cola) y soportar carruseles/Reels
- [ ] Refresh automático del token de Meta
