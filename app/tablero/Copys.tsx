"use client";
import { useRef, useState } from "react";
import s from "./page.module.css";
import { useStore } from "./useStore";

const STORE = "vmc-slogans-v3";

type CopyItem = { id: string; text: string; tag: string };

// Slogans para VMC. Eje de campaña: "Ahora subastamos de todo" + #SubastasVMC (claim de
// surtido en voz de marca). Ojo léxico: son SUBASTAS, no remates. Solo slogans: la agencia
// prueba variantes y copia la que use. Voz insider peruana, subasta > rifa.
const DEFAULT: CopyItem[] = [
  { id: "c1", text: "Ahora subastamos de todo.", tag: "Principal" },
  { id: "c2", text: "#SubastasVMC", tag: "Hashtag campaña" },
  { id: "c3", text: "Ya no solo autos.", tag: "Reveal" },
  { id: "c4", text: "Empezamos con autos. No terminamos ahí.", tag: "Variedad" },
  { id: "c5", text: "Autos, tech, muebles e inmuebles. Todo en un solo lugar.", tag: "Categorías" },
  { id: "c6", text: "Si tiene valor, aquí se subasta.", tag: "Martillo" },
  { id: "c7", text: "Si sabes subastar un auto, ya sabes subastar todo.", tag: "Mecánica" },
  { id: "c8", text: "Los autos no se van — ahora tienen vecinos.", tag: "Base autos" },
];

export default function Copys() {
  const [items, persist] = useStore<CopyItem[]>(STORE, DEFAULT);
  const [okId, setOkId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CopyItem | null>(null); // slogan nuevo sin guardar
  const draftRef = useRef<CopyItem | null>(null);            // lectura sincrónica (blur→Guardar)
  const setDraftValue = (next: CopyItem | null) => { draftRef.current = next; setDraft(next); };

  const edit = (id: string, field: keyof CopyItem, value: string) =>
    persist(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const del = (id: string) => persist(items.filter((i) => i.id !== id));

  // Abre un borrador: NO se persiste hasta que el usuario le da Guardar.
  const add = () => setDraftValue({ id: "c" + Date.now(), text: "", tag: "Opción" });
  const saveDraft = () => {
    const d = draftRef.current;
    if (d && d.text.trim()) persist([...items, d]);
    setDraftValue(null);
  };

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

      {draft && (
        <div className={s.modalOverlay} onClick={() => setDraftValue(null)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className={s.modalHead}>
              <div className={s.modalTitleWrap}>
                <span className={s.modalTitle}>Nuevo slogan</span>
              </div>
              <button className={s.drawerClose} onClick={() => setDraftValue(null)} aria-label="Cerrar">✕</button>
            </div>
            <div className={s.efields}>
              <div className={s.efield}>
                <span className={s.k}>Etiqueta</span>
                <Editable className={s.edit} value={draft.tag} onSave={(v) => setDraftValue({ ...draftRef.current!, tag: v })} placeholder="Etiqueta" />
              </div>
              <div className={`${s.efield} ${s.wide}`}>
                <span className={s.k}>Slogan</span>
                <Editable className={s.edit} value={draft.text} onSave={(v) => setDraftValue({ ...draftRef.current!, text: v })} placeholder="Escribe el slogan…" />
              </div>
            </div>
            <div className={s.modalFoot}>
              <button className={s.btn} onClick={() => setDraftValue(null)}>Cancelar</button>
              <button className={`${s.btn} ${s.primary}`} onClick={saveDraft}>Guardar slogan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Editable({ value, onSave, className, placeholder }:
  { value: string; onSave: (v: string) => void; className?: string; placeholder?: string }) {
  return (
    <div className={className} data-ph={placeholder || ""} contentEditable suppressContentEditableWarning spellCheck={false} title="Editable"
      onBlur={(e) => { const v = e.currentTarget.textContent.trim(); if (v !== value) onSave(v); }}>
      {value}
    </div>
  );
}
