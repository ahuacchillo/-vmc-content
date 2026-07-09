"use client";
import { useRef, useState } from "react";
import s from "./page.module.css";
import { useStore } from "./useStore";

const STORE = "vmc-matriz-v4";
const PHASES = ["Despertar", "Hype", "Reveal", "Lanzamiento"];
const PH_CLASS: Record<string, string> = { Despertar: "phDespertar", Hype: "phHype", Reveal: "phReveal", Lanzamiento: "phLanzamiento" };

// Tipos de post del feed (lo que IG muestra en la grilla). Stories va aparte, no ocupa celda.
const TYPES = ["Reel", "Carrusel", "Foto"];
const TYPE_ICON: Record<string, string> = { Reel: "▶", Carrusel: "⧉", Foto: "▣" };

type Row = {
  id: string; cd: string; date: string; dow: string; ph: string; type: string;
  obj: string; fmt: string; hook: string; cta: string; stories: string; justif: string;
  dday?: boolean;
};

// Base: análisis de growth @vmcsubastas (D-7 → D-Day, 7/8→7/15). Ángulo confirmado:
// sigue siendo VMC (NO cambio de nombre), pero el REVEAL es la expansión de categoría:
// "ya no solo autos — ahora subastas lo que quieras". Autos = ancla/base diaria y prueba
// de credibilidad; la expansión es la noticia que le da peso al 15/7.
// La base diaria de autos a subasta NO está aquí: sigue todos los días. Esto es la capa "héroe".
const DEFAULT: Row[] = [
  { id: "d7", cd: "D-7", date: "7/8", dow: "Mié", ph: "Despertar", type: "Reel", obj: "Reactivar la conversación",
    fmt: "Reel teaser sobre el logo · responder cada comentario",
    hook: "Algo está cambiando en VMC 👀", cta: "Coméntanos qué creen",
    stories: "Poll + countdown «7 días»",
    justif: "Los comentarios YA están activos (algunos posts con conversación real, otros vacíos). El teaser + pregunta directa reactiva los vacíos. Clave: responder todo comentario con intención de compra — hoy llegan leads («¿con quién me comunico?») y se pierden sin respuesta." },
  { id: "d6", cd: "D-6", date: "7/9", dow: "Jue", ph: "Despertar", type: "Carrusel", obj: "Dar valor / autoridad",
    fmt: "Carrusel: 3 errores al ofertar en una subasta de autos",
    hook: "6 años subastando autos nos enseñaron esto", cta: "Guarda este post",
    stories: "BTS del equipo + countdown",
    justif: "Damos valor antes de pedir nada. El carrusel útil se guarda, y el guardado es la señal más fuerte para que IG te muestre a gente nueva. De paso posiciona autoridad: sabemos de subastas desde 2020." },
  { id: "d5", cd: "D-5", date: "7/10", dow: "Vie", ph: "Despertar", type: "Reel", obj: "Construir confianza",
    fmt: "Reel: «Empezamos con autos… mira hasta dónde llegamos» (2020 → hoy)",
    hook: "Empezamos subastando autos. Ya no paramos ahí 👀", cta: "¿Qué te gustaría poder subastar?",
    stories: "Sticker de pregunta «¿qué subastarías?» + repost de respuestas",
    justif: "Viernes: la gente está más receptiva a lo emocional. Contamos los 6 años de autos como cimiento y plantamos la semilla de la expansión sin revelarla aún — el reveal se sentirá como evolución, no como «cambiaron y ya no los reconozco». La pregunta abre data real de qué categorías piden." },
  { id: "d4", cd: "D-4", date: "7/11", dow: "Sáb", ph: "Hype", type: "Reel", obj: "Enseñar la mecánica / mostrar el upgrade",
    fmt: "Reel screen-record: cómo pujar en la nueva app, paso a paso",
    hook: "Así de fácil será pujar en la nueva VMC 👀", cta: "Guarda este post para el 15/7",
    stories: "«Antes vs. Ahora» de la interfaz + countdown",
    justif: "Auditoría: la mecánica hoy es invisible en el perfil. Este es el activo educativo #1 — muestra el upgrade en vez de solo prometerlo, y se guarda al highlight «CÓMO PUJAR». Cambia la silueta-misterio por producto real: para 112K que ya confían, mostrar convierte más que intrigar. (Si vas a pautar para alcance frío, recupera un teaser de silueta en otro día.)" },
  { id: "d3", cd: "D-3", date: "7/12", dow: "Dom", ph: "Hype", type: "Carrusel", obj: "Prueba social + FOMO",
    fmt: "Carrusel: ganadores reales de estos años + «ahora será aún más fácil»",
    hook: "Miles ya ganaron su auto aquí — sin comisiones ni intermediarios", cta: "Únete a la lista de espera antes del 15/7 — link único",
    stories: "Repost de clips de ganadores + countdown «faltan 2 días» + link",
    justif: "Auditoría: falta prueba social. Los ganadores reales puentean la confianza de los 6 años hacia la plataforma nueva y abren la conversión suave a la waitlist, sin quemar el reveal." },
  { id: "d2", cd: "D-2", date: "7/13", dow: "Lun", ph: "Reveal", type: "Reel", obj: "Reveal total",
    fmt: "Reel + Carrusel oficial",
    hook: "Sigue siendo VMC. Y ahora subastas mucho más que autos 🔨", cta: "El 15/7 abren las ofertas — regístrate hoy para entrar primero",
    stories: "Countdown + sneak peek de categorías nuevas + link",
    justif: "EL REVEAL. Va HOY, no el día del lanzamiento, a propósito: 48 h para circular y generar comentarios antes de pedir registro. Dos mensajes fusionados: «sigue siendo VMC» (calma a los 112 K, no es cambio de marca) + «ya no solo autos» (la noticia real). Reel para alcance frío; carrusel para que la base sienta el «sigues en casa, solo que más grande»." },
  { id: "d1", cd: "D-1", date: "7/14", dow: "Mar", ph: "Reveal", type: "Reel", obj: "Urgencia",
    fmt: "Reel + Stories: preview de lotes de apertura — un auto + categorías nuevas (precios teaser)",
    hook: "Mañana, 15/7, abren estos lotes — y no todos son autos 👀", cta: "Activa tu recordatorio para mañana 15/7",
    stories: "Countdown cada pocas horas + «Activa notificaciones» + AMA opcional",
    justif: "Víspera. Todo el peso a recordatorios en Stories. El preview mezcla auto + categoría nueva para PROBAR que «lo que quieras» es real, no promesa. No competimos con nosotros mismos con un feed fuerte hoy. El escenario es de mañana." },
  { id: "dday", cd: "D-DAY", date: "7/15", dow: "Mié", ph: "Lanzamiento", type: "Reel", dday: true, obj: "Conversión",
    fmt: "Reel FIJADO + Carrusel + flood de Stories",
    hook: "El nuevo VMC ya está aquí 🚀", cta: "Regístrate y haz tu primera oferta HOY (link único)",
    stories: "Flood de Stories + link stickers + Live opcional",
    justif: "Día D. Reel fijado + un solo CTA medible. Y lo decisivo: responder cada comentario en la 1ª hora. Eso es lo que hace que el algoritmo empuje el lanzamiento a más gente." },
];

type EditableKey = "obj" | "fmt" | "hook" | "cta" | "stories" | "justif";
const FIELDS: [EditableKey, string, boolean][] = [
  ["obj", "Objetivo", false],
  ["cta", "CTA único", false],
  ["fmt", "Formato / Feed", true],
  ["hook", "Ángulo / Hook", true],
  ["stories", "Stories 3-4×", true],
  ["justif", "Por qué hoy", true],
];

// Los 7 días del plan base son fijos: se editan pero no se borran. Solo los añadidos se eliminan.
const BASE_IDS = new Set(DEFAULT.map((r) => r.id));

// ponytail: derivar tipo del texto del formato cuando falta (migración v3→v4)
const guessType = (fmt = ""): string =>
  /carrusel/i.test(fmt) ? "Carrusel" : /reel|video/i.test(fmt) ? "Reel" : "Foto";

export default function MatrixEditor() {
  const [raw, persist, { saved }] = useStore<Row[]>(STORE, DEFAULT);
  const [filter, setFilter] = useState<string | null>(null);
  const [view, setView] = useState<"grilla" | "detalle">("grilla");
  const [openId, setOpenId] = useState<string | null>(null); // celda existente abierta
  const [draft, setDraft] = useState<Row | null>(null);      // día nuevo sin guardar
  const draftRef = useRef<Row | null>(null);                 // lectura sincrónica (blur→Guardar)

  const setDraftValue = (next: Row | null) => { draftRef.current = next; setDraft(next); };

  // normaliza: garantiza `type` (migración v3→v4)
  const rows: Row[] = (raw || DEFAULT).map((r) => ({ ...r, type: r.type || guessType(r.fmt) }));

  const edit = (id: string, field: keyof Row, value: string) =>
    persist(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const del = (id: string) => {
    if (BASE_IDS.has(id)) return; // los días del plan base no se borran
    if (openId === id) setOpenId(null);
    persist(rows.filter((r) => r.id !== id));
  };

  const cyclePhase = (id: string) =>
    persist(rows.map((r) => {
      if (r.id !== id) return r;
      const next = PHASES[(PHASES.indexOf(r.ph) + 1) % PHASES.length];
      return { ...r, ph: next };
    }));

  const cycleType = (id: string) =>
    persist(rows.map((r) => {
      if (r.id !== id) return r;
      const next = TYPES[(TYPES.indexOf(r.type) + 1) % TYPES.length];
      return { ...r, type: next };
    }));

  // Abre un borrador: NO se persiste hasta que el usuario le da Guardar.
  const add = () => {
    setOpenId(null);
    setDraftValue({
      id: "x" + Date.now(),
      cd: "Día +", date: "7/?", dow: "—", ph: "Despertar", type: "Foto", obj: "",
      fmt: "", hook: "", cta: "", stories: "", justif: "",
    });
  };
  const saveDraft = () => { if (draftRef.current) persist([...rows, draftRef.current]); setDraftValue(null); };
  const cancelDraft = () => setDraftValue(null);

  const shown = rows.filter((r) => !filter || r.ph === filter);
  // mismo orden en ambas vistas: lo último publicado va primero (D-DAY = nuevo VMC)
  const ordered = [...shown].reverse();

  return (
    <>
      <div className={s.controls}>
        <div className={s.viewtoggle}>
          <button className={`${s.vbtn} ${view === "grilla" ? s.von : ""}`} onClick={() => setView("grilla")}>▦ Grilla</button>
          <button className={`${s.vbtn} ${view === "detalle" ? s.von : ""}`} onClick={() => setView("detalle")}>☰ Detalle</button>
        </div>

        <div className={s.phaseFilters}>
          <span className={s.phlbl}>Fase</span>
          {PHASES.map((p) => (
            <button
              key={p}
              className={`${s.phbtn} ${filter === p ? s.active : ""}`}
              onClick={() => setFilter((f) => (f === p ? null : p))}
            >{p}</button>
          ))}
          {filter && <button className={s.phclear} onClick={() => setFilter(null)} title="Quitar filtro">✕</button>}
        </div>

        <button className={`${s.btn} ${s.primary}`} onClick={add}>+ Añadir día</button>
      </div>

      <div className={s.controlsCaption}>
        <span className={s.legend}>
          {TYPES.map((t) => (<span key={t} className={s.legItem}><b>{TYPE_ICON[t]}</b> {t}</span>))}
        </span>
        <span className={`${s.saved} ${saved ? s.on : ""}`}>
          {saved ? "Guardado ✓" : "Edita cualquier texto · se guarda solo"}
        </span>
      </div>

      {view === "grilla" ? (
        <>
          {/* feed real: lo último publicado va arriba-izquierda (D-DAY = nuevo VMC) */}
          <div className={s.grid}>
            {ordered.map((r) => (
              <button
                key={r.id}
                className={`${s.cell} ${s[PH_CLASS[r.ph]] || ""} ${r.dday ? s.cellDday : ""} ${openId === r.id ? s.cellOpen : ""}`}
                onClick={() => setOpenId((o) => (o === r.id ? null : r.id))}
              >
                <span className={s.cellType} title={r.type}>{TYPE_ICON[r.type] || "▣"}</span>
                <span className={s.cellCd}>{r.cd}</span>
                <span className={s.cellHook}>{r.hook || <em className={s.cellEmpty}>Toca para editar</em>}</span>
                <span className={s.cellFoot}>{r.dow} {r.date} · {r.type}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className={s.matrix}>
          {ordered.map((r) => (
            <div key={r.id} className={`${s.ecard} ${r.dday ? s.dday : ""}`}>
              {BASE_IDS.has(r.id)
                ? <span className={s.delLock} title="Día del plan base — no se elimina">🔒</span>
                : <button className={s.del} onClick={() => del(r.id)} title="Eliminar día" aria-label="Eliminar día">✕</button>}
              <div className={s.eLeft}>
                <Editable className={s.cd} value={r.cd} onSave={(v) => edit(r.id, "cd", v)} />
                <Editable className={s.date} value={r.date} onSave={(v) => edit(r.id, "date", v)} />
                <Editable className={s.dow} value={r.dow} onSave={(v) => edit(r.id, "dow", v)} />
                <button className={s.typeTagSm} onClick={() => cycleType(r.id)} title="Clic: cambiar tipo">{TYPE_ICON[r.type]} {r.type}</button>
              </div>
              <div className={s.eRight}>
                <div className={s.cardTop}>
                  <button className={`${s.phtag} ${s[PH_CLASS[r.ph]] || ""}`} onClick={() => cyclePhase(r.id)} title="Clic para cambiar de fase">{r.ph || "Sin fase"}</button>
                  <Editable className={s.eObj} value={r.obj} onSave={(v) => edit(r.id, "obj", v)} />
                </div>
                <div className={s.efields}>
                  {FIELDS.filter(([k]) => k !== "obj").map(([k, label, wide]) => (
                    <div key={k} className={`${s.efield} ${wide ? s.wide : ""}`}>
                      <span className={s.k}>{label}</span>
                      <Editable className={`${s.edit} ${k === "hook" ? s.hook : ""}`} value={r[k]} onSave={(v) => edit(r.id, k, v)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(() => {
        const isDraft = !!draft;
        const r = isDraft ? draft : openId ? shown.find((x) => x.id === openId) : null;
        if (!r) return null;
        const close = isDraft ? cancelDraft : () => setOpenId(null);
        const setField = (k: keyof Row, v: string) =>
          isDraft ? setDraftValue({ ...draftRef.current!, [k]: v }) : edit(r.id, k, v);
        const doPhase = () => {
          if (!isDraft) return cyclePhase(r.id);
          const next = PHASES[(PHASES.indexOf(r.ph) + 1) % PHASES.length];
          setDraftValue({ ...draftRef.current!, ph: next });
        };
        const doType = () => {
          if (!isDraft) return cycleType(r.id);
          const next = TYPES[(TYPES.indexOf(r.type) + 1) % TYPES.length];
          setDraftValue({ ...draftRef.current!, type: next });
        };
        return (
          <div className={s.modalOverlay} onClick={close}>
            <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <div className={s.modalHead}>
                <div className={s.modalTitleWrap}>
                  <Editable className={s.modalTitle} value={r.cd} onSave={(v) => setField("cd", v)} placeholder="Día" />
                  <span className={s.modalSub}>
                    <Editable className={s.modalSubEd} value={r.dow} onSave={(v) => setField("dow", v)} placeholder="Día sem." />
                    <span className={s.dot2}>·</span>
                    <Editable className={s.modalSubEd} value={r.date} onSave={(v) => setField("date", v)} placeholder="Fecha" />
                  </span>
                </div>
                <button className={s.drawerClose} onClick={close} aria-label="Cerrar">✕</button>
              </div>

              <div className={s.modalTags}>
                <button className={`${s.phtag} ${s[PH_CLASS[r.ph]] || ""}`} onClick={doPhase} title="Clic: cambiar fase">{r.ph}</button>
                <button className={s.typeTag} onClick={doType} title="Clic: cambiar tipo">{TYPE_ICON[r.type]} {r.type}</button>
                {!isDraft && (BASE_IDS.has(r.id)
                  ? <span className={s.lock} title="Día del plan base — no se elimina">🔒 fijo</span>
                  : <button className={s.delText} onClick={() => del(r.id)}>Eliminar día</button>)}
              </div>

              <div className={s.efields}>
                {FIELDS.map(([k, label, wide]) => (
                  <div key={k} className={`${s.efield} ${wide ? s.wide : ""}`}>
                    <span className={s.k}>{label}</span>
                    <Editable className={`${s.edit} ${k === "hook" ? s.hook : ""}`} value={r[k]} onSave={(v) => setField(k, v)} placeholder={label} />
                  </div>
                ))}
              </div>

              {isDraft && (
                <div className={s.modalFoot}>
                  <button className={s.btn} onClick={cancelDraft}>Cancelar</button>
                  <button className={`${s.btn} ${s.primary}`} onClick={saveDraft}>Guardar día</button>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </>
  );
}

// contentEditable no controlado: guarda en onBlur, sin saltos de cursor.
function Editable({ value, onSave, className, placeholder }:
  { value: string; onSave: (v: string) => void; className?: string; placeholder?: string }) {
  return (
    <div
      className={className}
      data-ph={placeholder || ""}
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
