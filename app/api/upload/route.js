import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

// Guarda la imagen en public/uploads y devuelve su URL pública.
// Instagram descarga la imagen DESDE esa URL, así que debe ser accesible por internet.
// ponytail: disco local. Pasar a S3/CDN cuando haya más de una instancia o se llene el disco.
export async function POST(req) {
  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return Response.json({ error: "No se recibió archivo." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${(file.name || "post").replace(/[^\w.-]/g, "_")}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);

  const base = process.env.PUBLIC_BASE_URL || new URL(req.url).origin;
  return Response.json({ url: `${base}/uploads/${name}` });
}
