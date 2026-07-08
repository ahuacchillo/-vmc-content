"use client";
import { useState } from "react";
import s from "./page.module.css";
import { useStore } from "./useStore";

const STORE = "vmc-copys-v1";

type CopyItem = { id: string; text: string; tag: string };

// Opciones de slogan/copy para VMC. Editable: la agencia prueba variantes y copia la que use.
const DEFAULT: CopyItem[] = [
  { id: "c1", text: "Vende lo que quieras, vende con VMC", tag: "Slogan" },
  { id: "c2", text: "Vende con VMC", tag: "Slogan corto" },
  { id: "c3", text: "Compra y vende autos en subasta, directo de financieras y aseguradoras.", tag: "Bio" },
  { id: "c4", text: "Sigue siendo VMC — subimos de nivel.", tag: "Reveal" },
];

export default function Copys() {
  const [items, persist] = useStore<CopyItem[]>(STORE, DEFAULT);
  const [okId, setOkId] = useState<string | null>(null);

  const edit = (id: string, field: keyof CopyItem, value: string) =>
    persist(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const del = (id: string) => persist(items.filter((i) => i.id !== id));
  const add = () => persist([...items, { id: "c" + Date.now(), text: "Nuevo copy…", tag: "Opción" }]);
  const reset = () => persist(DEFAULT);

  const copy = async (id: string, text: string) => {
    try { await navigator.clipboard.writeText(text); setOkId(id); setTimeout(() => setOkId(null), 1400); } catch {}
  };

  return (
    <div className={s.copys}>
      <div className={s.toolbar}>
        <button className={`${s.btn} ${s.primary}`} onClick={add}>+ Añadir copy</button>
        <button className={s.btn} onClick={reset}>Restablecer</button>
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
