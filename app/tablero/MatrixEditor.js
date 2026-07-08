"use client";
import { useEffect, useRef, useState } from "react";
import s from "./page.module.css";

const STORE = "vmc-matriz-v3";
const PHASES = ["Despertar", "Hype", "Reveal", "Lanzamiento"];
const PH_CLASS = { Despertar: "phDespertar", Hype: "phHype", Reveal: "phReveal", Lanzamiento: "phLanzamiento" };

// Base: análisis de growth @vmcsubastas (D-7 → D-Day, 7/8→7/15). Ángulo confirmado:
// sigue siendo VMC, evolución con el ADN de Subascars — NO es cambio de nombre.
// La base diaria de autos a subasta NO está aquí: sigue todos los días. Esto es la capa "héroe".
const DEFAULT = [
  { id: "d7", cd: "D-7", date: "7/8", dow: "Mié", ph: "Despertar", obj: "Reabrir la conversación",
    fmt: "Reel teaser sobre el logo · comentarios ACTIVADOS",
    hook: "Algo está cambiando en VMC 👀", cta: "Coméntanos qué creen",
    stories: "Poll + countdown «7 días»",
    justif: "La cuenta lleva meses sin conversación real. Antes de generar hype hay que reabrir el canal: comentarios ON y una pregunta directa. Si no, el reveal le habla a un cuarto vacío." },
  { id: "d6", cd: "D-6", date: "7/9", dow: "Jue", ph: "Despertar", obj: "Dar valor / autoridad",
    fmt: "Carrusel: 3 errores al ofertar en una subasta de autos",
    hook: "6 años subastando autos nos enseñaron esto", cta: "Guarda este post",
    stories: "BTS del equipo + countdown",
    justif: "Damos valor antes de pedir nada. El carrusel útil se guarda, y el guardado es la señal más fuerte para que IG te muestre a gente nueva. De paso posiciona autoridad: sabemos de subastas desde 2020." },
  { id: "d5", cd: "D-5", date: "7/10", dow: "Vie", ph: "Despertar", obj: "Construir confianza",
    fmt: "Reel: «De 2020 a hoy» con los highlights por año como hilo",
    hook: "La historia real de la cuenta conecta con lo que viene", cta: "Cuéntanos desde cuándo nos sigues",
    stories: "Sticker de pregunta + repost de respuestas",
    justif: "Viernes: la gente está más receptiva a lo emocional. Contamos los 6 años para que el reveal se sienta como evolución, no como «cambiaron y ya no los reconozco»." },
  { id: "d4", cd: "D-4", date: "7/11", dow: "Sáb", ph: "Hype", obj: "Encender la intriga",
    fmt: "Carrusel reveal parcial — silueta / logo borroso",
    hook: "¿Adivinas qué se viene?", cta: "Tíranos tu teoría en comentarios",
    stories: "Countdown + repost de las mejores teorías",
    justif: "Fin de semana = más scroll. La silueta fuerza el «¿qué es?» en comentarios: puro combustible de interacción. Empezamos a mover tráfico a la lista de espera. Si algo se pauta, es este." },
  { id: "d3", cd: "D-3", date: "7/12", dow: "Dom", ph: "Hype", obj: "Beneficio + FOMO",
    fmt: "Reel: beneficio central sin nombrar la marca nueva",
    hook: "Esto cambia cómo compras y vendes tu auto en Perú", cta: "Únete a la lista de espera (un solo link)",
    stories: "Countdown + link sticker",
    justif: "Movemos de intriga a beneficio: qué gana la gente. Abrimos la conversión suave a la waitlist, sin quemar el reveal todavía." },
  { id: "d2", cd: "D-2", date: "7/13", dow: "Lun", ph: "Reveal", obj: "Reveal total",
    fmt: "Reel + Carrusel oficial",
    hook: "Sigue siendo VMC — subimos de nivel, con el ADN de Subascars", cta: "Sé de los primeros en acceder",
    stories: "Countdown + sneak peek + link",
    justif: "El reveal va HOY, no el día del lanzamiento, a propósito: le damos 48 h para circular y generar comentarios antes de pedir el registro. Reel porque necesitamos alcance frío; carrusel porque la base necesita el «sigues en casa»." },
  { id: "d1", cd: "D-1", date: "7/14", dow: "Mar", ph: "Reveal", obj: "Urgencia",
    fmt: "Solo Stories: «Mañana cambia todo»",
    hook: "Urgencia pura", cta: "Activa tu recordatorio",
    stories: "Countdown cada pocas horas + AMA opcional",
    justif: "Víspera. Todo el peso a recordatorios en Stories. No competimos con nosotros mismos con un feed fuerte hoy — el escenario es de mañana." },
  { id: "dday", cd: "D-DAY", date: "7/15", dow: "Mié", ph: "Lanzamiento", dday: true, obj: "Conversión",
    fmt: "Reel FIJADO + Carrusel + flood de Stories",
    hook: "El nuevo VMC ya está aquí 🚀", cta: "Regístrate y haz tu primera oferta (link único)",
    stories: "Flood de Stories + link stickers + Live opcional",
    justif: "Día D. Reel fijado + un solo CTA medible. Y lo decisivo: responder cada comentario en la 1ª hora. Eso es lo que hace que el algoritmo empuje el lanzamiento a más gente." },
];

const FIELDS = [
  ["obj", "Objetivo", false],
  ["fmt", "Formato / Feed", true],
  ["hook", "Ángulo / Hook", true],
  ["cta", "CTA único", false],
  ["stories", "Stories 3-4×", true],
  ["justif", "Por qué hoy", true],
];

export default function MatrixEditor() {
  const [rows, setRows] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState(null);
  const first = useRef(true);

  // cargar lo guardado tras montar (evita desajuste de hidratación)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) setRows(JSON.parse(raw));
    } catch {}
    first.current = false;
  }, []);

  const persist = (next) => {
    setRows(next);
    try { localStorage.setItem(STORE, JSON.stringify(next)); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const edit = (id, field, value) =>
    persist(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const del = (id) => persist(rows.filter((r) => r.id !== id));

  // clic en el tag de un día → avanza a la siguiente fase (reasignar)
  const cyclePhase = (id) =>
    persist(rows.map((r) => {
      if (r.id !== id) return r;
      const next = PHASES[(PHASES.indexOf(r.ph) + 1) % PHASES.length];
      return { ...r, ph: next };
    }));

  const add = () =>
    persist([...rows, {
      id: "x" + rows.length + "-" + rows.reduce((a, r) => a + r.id.length, 0),
      cd: "+", date: "7/?", dow: "—", ph: "Despertar", obj: "Nuevo objetivo",
      fmt: "Formato", hook: "Ángulo / hook", cta: "CTA", stories: "Stories", justif: "¿Por qué este día?",
    }]);

  const reset = () => { try { localStorage.removeItem(STORE); } catch {} setRows(DEFAULT); };

  return (
    <>
      <div className={s.toolbar}>
        <button className={`${s.btn} ${s.primary}`} onClick={add}>+ Añadir día</button>
        <button className={s.btn} onClick={reset}>Restablecer</button>
        <span className={`${s.saved} ${saved ? s.on : ""}`}>
          {saved ? "Guardado ✓" : "Edita cualquier texto · se guarda solo"}
        </span>
      </div>

      <div className={s.phbar}>
        <span className={s.phlbl}>Filtrar fase:</span>
        {PHASES.map((p) => (
          <button
            key={p}
            className={`${s.phbtn} ${filter === p ? s.active : ""}`}
            onClick={() => setFilter((f) => (f === p ? null : p))}
          >{p}</button>
        ))}
      </div>

      <div className={s.matrix}>
        {rows.map((r) => (
          <div key={r.id} className={`${s.ecard} ${r.dday ? s.dday : ""} ${filter && r.ph !== filter ? s.dim : ""}`}>
            <button className={s.del} onClick={() => del(r.id)} title="Eliminar día" aria-label="Eliminar día">✕</button>
            <div className={s.eLeft}>
              <Editable className={s.cd} value={r.cd} onSave={(v) => edit(r.id, "cd", v)} />
              <Editable className={s.date} value={r.date} onSave={(v) => edit(r.id, "date", v)} />
              <Editable className={s.dow} value={r.dow} onSave={(v) => edit(r.id, "dow", v)} />
            </div>
            <div className={s.eRight}>
              <div className={s.cardTop}>
                <button
                  className={`${s.phtag} ${s[PH_CLASS[r.ph]] || ""}`}
                  onClick={() => cyclePhase(r.id)}
                  title="Clic para cambiar de fase"
                >{r.ph || "Sin fase"}</button>
                <Editable className={s.eObj} value={r.obj} onSave={(v) => edit(r.id, "obj", v)} />
              </div>
              <div className={s.efields}>
                {FIELDS.filter(([k]) => k !== "obj").map(([k, label, wide]) => (
                  <div key={k} className={`${s.efield} ${wide ? s.wide : ""}`}>
                    <span className={s.k}>{label}</span>
                    <Editable
                      className={`${s.edit} ${k === "hook" ? s.hook : ""}`}
                      value={r[k]}
                      onSave={(v) => edit(r.id, k, v)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// contentEditable no controlado: guarda en onBlur, sin saltos de cursor.
function Editable({ value, onSave, className }) {
  return (
    <div
      className={className}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      title="Editable"
      onBlur={(e) => {
        const v = e.currentTarget.textContent.trim();
        if (v !== value) onSave(v);
      }}
    >
      {value}
    </div>
  );
}
