# Subastop · Publicador de Instagram

App propia (Next.js) para publicar en el Instagram de Subastop sin herramientas de terceros.
Empieza mínima: **subir imagen → caption → publicar ahora**. Encima se cuelga lo que surja.

## Estado actual (v1 — esqueleto que ya publica)

- [x] Subir imagen + caption + publicar imagen única en el feed
- [x] Token del lado servidor (nunca llega al navegador)
- [ ] Programar para más tarde (cola)  ← siguiente
- [ ] Carruseles y Reels
- [ ] Triggers desde eventos de Subastop (lote abre / cierra 24h / vendido)
- [ ] Multi-cuenta y refresh automático del token

## Requisitos de Meta (el cuello de botella — empezar YA)

Publicar por API necesita, una sola vez:

1. Cuenta de Instagram **Business o Creator** (no personal).
2. Vinculada a una **Página de Facebook**.
3. Una app en [Meta for Developers](https://developers.facebook.com/) con el producto
   **Instagram Graph API**.
4. **App Review** para el permiso `instagram_content_publish` — tarda días/semanas,
   por eso se arranca primero. En modo desarrollo funciona con tu propia cuenta sin review,
   sirve para probar todo antes.

De ahí sacas `IG_USER_ID` (id de la cuenta IG Business) y un `IG_ACCESS_TOKEN`
de larga duración (~60 días; hay que refrescarlo — pendiente en el roadmap).

## Correr en local

```bash
npm install
cp .env.example .env      # y completa IG_USER_ID, IG_ACCESS_TOKEN, PUBLIC_BASE_URL
npm run dev               # http://localhost:3000
```

> **Importante:** Instagram descarga la imagen desde `PUBLIC_BASE_URL`, así que esa URL
> debe ser accesible por internet. En local, levanta un túnel:
> `ngrok http 3000` y pega la URL `https` que te dé en `PUBLIC_BASE_URL`.
> En producción, tu dominio.

## Probar la lógica sin red

```bash
npm test        # self-check de publishImage con fetch falso
```

## Cómo está armado

```
lib/instagram.mjs        las 2 llamadas al Graph API (contenedor -> publish). Testeable.
app/api/upload/route.js  guarda la imagen y devuelve su URL pública
app/api/publish/route.js lee el token del entorno y publica
app/page.js              la UI (subir / caption / publicar)
```

Para crecer: cada casilla del roadmap es un archivo o endpoint nuevo, sin rehacer lo de abajo.
