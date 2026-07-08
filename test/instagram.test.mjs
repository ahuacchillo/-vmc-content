// Self-check sin red: fetch falso. Corre con `npm test`.
import assert from "node:assert/strict";
import { publishImage } from "../lib/instagram.mjs";

// fetch falso: 1ª llamada devuelve el contenedor, 2ª el media publicado.
function fakeFetch(seq) {
  let i = 0;
  return async () => {
    const r = seq[i++];
    return { ok: r.ok ?? true, statusText: "OK", json: async () => r.body };
  };
}

// camino feliz: contenedor -> publish -> devuelve id final
{
  const f = fakeFetch([{ body: { id: "CONTAINER_1" } }, { body: { id: "MEDIA_9" } }]);
  const id = await publishImage(
    { igId: "1", token: "t", imageUrl: "https://x/p.jpg", caption: "hola" },
    f
  );
  assert.equal(id, "MEDIA_9");
}

// error de la API -> throw con el mensaje de Meta
{
  const f = fakeFetch([{ ok: false, body: { error: { message: "token vencido" } } }]);
  await assert.rejects(
    () => publishImage({ igId: "1", token: "t", imageUrl: "https://x/p.jpg" }, f),
    /token vencido/
  );
}

// falta token -> throw antes de tocar la red
await assert.rejects(
  () => publishImage({ igId: "1", token: "", imageUrl: "https://x/p.jpg" }),
  /IG_ACCESS_TOKEN/
);

// falta imagen -> throw
await assert.rejects(
  () => publishImage({ igId: "1", token: "t", imageUrl: "" }),
  /imagen/
);

console.log("ok — instagram.publishImage");
