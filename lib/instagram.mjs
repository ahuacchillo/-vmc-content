// Publicación en Instagram vía Graph API (Content Publishing).
// Todo del lado servidor: el token NUNCA sale al navegador.
// fetchImpl es inyectable para poder testear sin red.

const GRAPH = "https://graph.facebook.com/v21.0";

export async function publishImage({ igId, token, imageUrl, caption }, fetchImpl = fetch) {
  if (!igId || !token) throw new Error("Falta IG_USER_ID o IG_ACCESS_TOKEN en el entorno.");
  if (!imageUrl) throw new Error("Falta la imagen a publicar.");

  // 1) crear contenedor de media
  const container = await graphPost(fetchImpl, `${GRAPH}/${igId}/media`, {
    image_url: imageUrl,
    caption: caption ?? "",
    access_token: token,
  });

  // 2) publicar el contenedor
  // ponytail: para video/Reels hay que sondear status_code=FINISHED antes de publicar.
  //           Imagen es inmediato, así que publicamos directo. Añadir polling cuando toque Reels.
  const published = await graphPost(fetchImpl, `${GRAPH}/${igId}/media_publish`, {
    creation_id: container.id,
    access_token: token,
  });

  return published.id; // id del media publicado en Instagram
}

async function graphPost(fetchImpl, url, params) {
  const res = await fetchImpl(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    throw new Error(`Instagram API: ${data.error?.message || res.statusText || "error desconocido"}`);
  }
  if (!data.id) throw new Error("Instagram API: respuesta sin id.");
  return data;
}
