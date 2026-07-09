"use client";
import { useState } from "react";
import s from "./page.module.css";
import { useStore } from "./useStore";

const STORE = "vmc-slogans-v2";

type CopyItem = { id: string; text: string; tag: string };

// Slogans para VMC. Eje de campaña: "Todo se remata" + #TodoSeRemata (variedad
// inequívoca, no "Con Todo" que se lee como actitud). Solo slogans: la agencia
// prueba variantes y copia la que use. Voz insider peruana, subasta > rifa.
const DEFAULT: CopyItem[] = [
  { id: "c1", text: "Todo se remata.", tag: "Principal" },
  { id: "c2", text: "#TodoSeRemata", tag: "Hashtag campaña" },
  { id: "c3", text: "Ya no solo autos.", tag: "Reveal" },
  { id: "c4", text: "Empezamos con autos. No terminamos ahí.", tag: "Variedad" },
  { id: "c5", text: "Autos, tech, muebles e inmuebles. Todo en un solo lugar.", tag: "Categorías" },
  { id: "c6", text: "Si tiene valor, aquí se remata.", tag: "Martillo" },
  { id: "c7", text: "Si sabes rematar un auto, ya sabes rematar todo.", tag: "Mecánica" },
  { id: "c8", text: "Los autos no se van — ahora tienen vecinos.", tag: "Base autos" },
];

export default function Copys() {
  const [items, persist] = useStore<CopyItem[]>(STORE, DEFAULT);
  const [okId, setOkId] = useState<string | null>(null);

  const edit = (id: string, field: keyof CopyItem, value: string) =>
    persist(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const del = (id: string) => persist(items.filter((i) => i.id !== id));
  const add = () => persist([...items, { id: "c" + Date.now(), text: "Nuevo slogan…", tag: "Opción" }]);

  const copy = async (id: string, text: string) => {
    try { await navigator.clipboard.writeText(text); setOkId(id); setTimeout(() => setOkId(null), 1400); } catch {}
  };

  return (
    <div className={s.copys}>
      <div className={s.toolbar}>
        <button className={`${s.btn} ${s.primary}`} onClick={add}>+ Añadir slogan</button>
        <span className={s.saved}>Edita el texto o la etiqueta · se guarda solo</span>
      </div>
      <div className={s.copyGrid}>
        {items.map((i) => (
          <div key={i.id} className={s.copyOpt}>
            <div className={s.copyOptTop}>
              <Editable className={s.copyTag} value={i.tag} onSave={(v) => edit(i.id, "tag", v)} />
              <button className={`${s.copyBtn} ${okId === i.id ? s.ok : ""}`} onClick={() => copy(i.id, i.text)}>
                {okId === i.id ? "Copiado ✓" : "Copiar"}
              </button>
              <button className={s.del2} onClick={() => del(i.id)} title="Eliminar" aria-label="Eliminar">✕</button>
            </div>
            <Editable className={s.copyText} value={i.text} onSave={(v) => edit(i.id, "text", v)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Editable({ value, onSave, className }:
  { value: string; onSave: (v: string) => void; className?: string }) {
  return (
    <div className={className} contentEditable suppressContentEditableWarning spellCheck={false} title="Editable"
      onBlur={(e) => { const v = e.currentTarget.textContent.trim(); if (v !== value) onSave(v); }}>
      {value}
    </div>
  );
}
