"use client";
import { useState } from "react";

export default function Publicar() {
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<{ kind: "ok" | "err" | "info"; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setStatus({ kind: "info", msg: "Subiendo imagen…" });
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Falló la subida.");
      setImageUrl(d.url);
      setStatus({ kind: "info", msg: "Imagen lista. Escribe el caption y publica." });
    } catch (err) {
      setStatus({ kind: "err", msg: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true);
    setStatus({ kind: "info", msg: "Publicando en Instagram…" });
    try {
      const r = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, caption }),
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || "No se pudo publicar.");
      setStatus({ kind: "ok", msg: `Publicado ✓  (media ${d.id})` });
    } catch (err) {
      setStatus({ kind: "err", msg: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="wrap">
      <header>
        <span className="eyebrow">Subastop · Publicador</span>
        <h1>Publicar en Instagram</h1>
        <a className="navlink" href="/tablero">← Plan de lanzamiento @vmcsubastas</a>
      </header>

      <label className="drop">
        {preview
          ? <img src={preview} alt="Vista previa del post" />
          : <span>Seleccionar imagen del post</span>}
        <input type="file" accept="image/jpeg,image/png" onChange={onFile} hidden />
      </label>

      <textarea
        className="caption"
        placeholder="Caption… (incluye hashtags y llamada a pujar)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={5}
      />

      <button className="publish" onClick={publish} disabled={busy || !imageUrl}>
        {busy ? "…" : "Publicar ahora"}
      </button>

      {status && <p className={`status ${status.kind}`}>{status.msg}</p>}
    </main>
  );
}
