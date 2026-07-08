# VMC Content HQ

App propia (Next.js) para la gestión de contenido de **@vmcsubastas** (SUBASTOP S.A.C.):
el plan de lanzamiento y el publicador de Instagram, en un solo lugar. Base para
conectar más adelante modelos de IA y distribución de contenido.

## Rutas

| Ruta | Qué es |
|---|---|
| `/` | Redirige a `/tablero` |
| `/tablero` | **Plan de lanzamiento @vmcsubastas** — auditoría, optimización de perfil (copy-paste de Nombre/Bio/CTA), cadencia justificada y **matriz de 7 días editable** (filtrable por fase, se guarda en el navegador). |
| `/publicar` | **Publicador de Instagram** — subir imagen → caption → publicar en el feed. |

## Correr en local

```bash
npm install
cp .env.example .env      # completa IG_USER_ID, IG_ACCESS_TOKEN, PUBLIC_BASE_URL (solo para /publicar)
npm run dev               # http://localhost:3000
```

> El tablero funciona sin configurar nada. El `.env` solo hace falta para el publicador.

## El tablero (`/tablero`)

- Matriz editable: haz clic en cualquier texto para editarlo; se guarda solo en el navegador
  (`localStorage`). **Añadir día**, **✕** por fila y **Restablecer** al plan base.
- Tags de fase (Despertar / Hype / Reveal / Lanzamiento): la barra superior **filtra**;
  el tag de cada card se **reasigna** al hacer clic.
- Piel del design system Concorde/VMC (paleta naranja→vault + teal, Plus Jakarta Sans).

> La edición vive en el navegador de quien edita — todavía no se comparte entre dispositivos
> ni personas. Persistencia compartida = pendiente (necesita backend).

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
app/tablero/            plan de lanzamiento (page.js + MatrixEditor + CopyBlock + estilos)
app/publicar/page.js    UI del publicador
app/api/upload/route.js guarda la imagen y devuelve su URL pública
app/api/publish/route.js lee el token del entorno y publica
lib/instagram.mjs        las 2 llamadas al Graph API (contenedor → publish). Testeable.
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
