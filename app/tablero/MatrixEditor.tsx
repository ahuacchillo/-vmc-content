"use client";
import { useRef, useState } from "react";
import s from "./page.module.css";
import { useStore } from "./useStore";

const STORE = "vmc-matriz-v8";
const PHASES = ["Despertar", "Hype", "Reveal", "Lanzamiento"];
const PH_CLASS: Record<string, string> = { Despertar: "phDespertar", Hype: "phHype", Reveal: "phReveal", Lanzamiento: "phLanzamiento" };

// Tipos de post del feed (lo que IG muestra en la grilla). Stories va aparte, no ocupa celda.
const TYPES = ["Reel", "Carrusel", "Foto"];
const TYPE_ICON: Record<string, string> = { Reel: "▶", Carrusel: "⧉", Foto: "▣" };

// Pauta (pieza con presupuesto detrás). Ausencia = orgánico. El objetivo dice para qué.
// Ciclo: Orgánico → Alcance → Tráfico → Conversión → Orgánico.
const CAMPAIGNS = ["Alcance", "Tráfico", "Conversión"];
const nextCampaign = (c?: string): string | undefined => {
  const i = c ? CAMPAIGNS.indexOf(c) : -1;
  return i >= CAMPAIGNS.length - 1 ? undefined : CAMPAIGNS[i + 1];
};

type Row = {
  id: string; cd: string; dow: string; ph: string; type: string; // cd = fecha dd/mm/aaaa
  obj: string; fmt: string; hook: string; cta: string; stories: string; justif: string;
  dday?: boolean; campaign?: string; // objetivo de pauta; undefined = orgánico
  folder?: string; // enlace a la carpeta de diseño (renders / fotos del día)
};

// Base: análisis de growth @vmcsubastas. Ángulo confirmado: sigue siendo VMC (NO cambio
// de nombre); el hito es el ESTRENO del nuevo skin/plataforma (15/07/2026), y de fondo la
// expansión de categorías «ya no solo autos» que se INTEGRA POCO A POCO (no big-bang).
// EJE DE CAMPAÑA: "Ahora subastamos de todo" + #SubastasVMC (claim de surtido en voz de
// marca). Ojo léxico: son SUBASTAS, no remates — se dice subastar/subasta/pujar, nunca rematar.
// 4 verticales: 🚗 Autos (ancla/base diaria, prueba de credibilidad) · 📱 Tech · 🛋️ Muebles ·
// 🏠 Inmuebles. Autos NO se va: es la casa; las categorías nuevas entran de a pocos, tech primero.
// Reassurance a la base: "los autos no se van — ahora tienen vecinos".
// La base diaria de autos a subasta NO está aquí: sigue todos los días. Esto es la capa "héroe".
// Arranca Vie 10/07 y corre hasta Vie 17/07 (prórroga post-estreno donde la conversión del
// pool ya maduro se sigue exprimiendo).
// Pauta reducida a 3 (reglas): 10/07 Alcance (siembra pool) · 13/07 Alcance (estreno) · 15/07 Conversión.
const DEFAULT: Row[] = [
  { id: "d5", cd: "10/07/2026", dow: "Vie", ph: "Despertar", type: "Reel", campaign: "Alcance", obj: "Abrir conversación + anticipar el nuevo skin",
    fmt: "Reel: «Empezamos con autos… mira hasta dónde llegamos» (2020 → hoy) — teaser del skin nuevo",
    hook: "Ya no solo autos. Y muy pronto, con cara nueva.", cta: "¿Qué te gustaría subastar? Tíralo abajo — respondemos TODO #SubastasVMC",
    stories: "Poll «¿qué subastarías?» + sticker de pregunta + repost de respuestas (reactivar comentarios)",
    justif: "PRIMERA pieza del sprint corto (arrancamos Vie 10/07, sin teaser previo): carga doble. (1) Anticipa el estreno del skin nuevo y nombra el rumbo («ya no solo autos»), que sobre 6 años de autos se siente evolución, no ruptura. (2) REACTIVA la cuenta: está fría y sin señal el algoritmo no empuja el estreno — la pregunta + responder cada comentario desde hoy es no negociable. Estrena #SubastasVMC (UGC «¿y esto se subasta?») y su pauta de Alcance arranca el pool de retargeting desde el día 1." },
  { id: "d4", cd: "11/07/2026", dow: "Sáb", ph: "Hype", type: "Reel", obj: "Enseñar la mecánica / mostrar el upgrade",
    fmt: "Reel screen-record: la misma puja sobre un auto y sobre un lote nuevo (tech), lado a lado",
    hook: "Cómo pujar en 30 segundos: si sabes subastar un auto, ya sabes subastar todo.", cta: "Guárdalo — te va a servir el 15/07",
    stories: "«Antes vs. Ahora» de la interfaz + countdown",
    justif: "Auditoría: la mecánica hoy es invisible en el perfil. Activo educativo #1 — muestra el upgrade del skin en vez de prometerlo, y se guarda al highlight «CÓMO PUJAR». Absorbe el trabajo del carrusel de valor: el ángulo «cómo pujar en 30s» es guardable, y el guardado es la señal más barata para alcance frío nuevo. Clave: la mecánica de subasta es idéntica para un auto o un lote nuevo, nadie reaprende nada. Para 112K que ya confían, mostrar convierte más que intrigar." },
  { id: "d3", cd: "12/07/2026", dow: "Dom", ph: "Hype", type: "Carrusel", obj: "Prueba social + FOMO",
    fmt: "Carrusel: ganadores reales de estos años + «ahora será aún más fácil»",
    hook: "Miles ya se llevaron su auto acá. Sin comisiones, sin intermediarios. Y esto recién empieza.", cta: "Regístrate en la lista HOY — los lotes de apertura son limitados (un solo link) #SubastasVMC",
    stories: "Repost de clips de ganadores + countdown «faltan 2 días» + link a la lista",
    justif: "Auditoría: falta prueba social. Los ganadores reales puentean la confianza de los 6 años hacia la plataforma nueva. Con el pool de retargeting aún joven ENDURECEMOS el pedido de registro (antes conversión «suave»): CTA directo a la lista con escasez real (lotes de apertura limitados), sin quemar el estreno del 13/07." },
  { id: "d2", cd: "13/07/2026", dow: "Lun", ph: "Reveal", type: "Reel", campaign: "Alcance", obj: "Estreno de plataforma + rumbo de categorías",
    fmt: "Reel + Carrusel oficial · abre con un auto, luego adelanta tech · muebles · inmuebles (entran de a pocos)",
    hook: "Seguimos siendo VMC. Estrenamos plataforma — y ahora subastamos de todo: autos, tech, y lo que viene.", cta: "El 15/07 estrenamos. Regístrate hoy y entra primero. #SubastasVMC",
    stories: "Countdown + sneak peek del skin nuevo + adelanto de categorías + link · cierre «#SubastasVMC»",
    justif: "EL ESTRENO se anuncia HOY, no el día del lanzamiento: 48 h para circular y generar comentarios antes de pedir registro. Dos mensajes fusionados: «sigue siendo VMC» (calma a los 112 K, no es cambio de marca) + «ahora subastamos de todo» (el rumbo real). Clave del reencuadre: las categorías nuevas NO abren todas de golpe — entran poco a poco (tech primero); hoy se siembra la expectativa, no se promete un catálogo completo. Reassurance a la base: «los autos no se van — ahora tienen vecinos». Abrir con un auto para que lo primero que vean siga siendo casa. Reel para alcance frío; carrusel para la base." },
  { id: "d1", cd: "14/07/2026", dow: "Mar", ph: "Reveal", type: "Reel", obj: "Urgencia",
    fmt: "Reel + Stories: preview del skin nuevo + primeros lotes de apertura (un auto + un adelanto de tech)",
    hook: "Mañana estrenamos plataforma. Y ojo: no todo tiene 4 ruedas.", cta: "Activa el recordatorio para mañana 9 a.m.",
    stories: "Countdown cada pocas horas + «Activa notificaciones» + AMA opcional",
    justif: "Víspera. Todo el peso a recordatorios en Stories. El preview mezcla el skin nuevo + un auto + un adelanto de tech para PROBAR que «subastamos de todo» empieza en serio, sin prometer las 4 categorías abiertas a la vez. No competimos con nosotros mismos con un feed fuerte hoy. El escenario es de mañana." },
  { id: "dday", cd: "15/07/2026", dow: "Mié", ph: "Lanzamiento", type: "Reel", dday: true, campaign: "Conversión", obj: "Conversión / estreno de plataforma",
    fmt: "Reel FIJADO + Carrusel catálogo (slide 1 = auto fuerte, luego el primer lote de categoría nueva) + flood de Stories",
    hook: "Ya está aquí la nueva plataforma. Subastamos de todo — arrancamos con autos y tech. Haz tu primera oferta.", cta: "Regístrate y subasta hoy (un solo link) #SubastasVMC",
    stories: "Flood de Stories por categoría disponible + link stickers + guardar a highlight «NUEVO 🔨» + Live opcional",
    justif: "Día del estreno. Reel fijado + un solo CTA medible. El carrusel-catálogo abre con un auto (tranquiliza a la base) y recién ahí muestra la PRIMERA categoría nueva en vivo (tech) — el resto se comunica como «va entrando», fiel al rollout gradual. Lo decisivo: responder cada comentario en la 1ª hora. Eso es lo que hace que el algoritmo empuje el estreno a más gente." },
  { id: "dplus1", cd: "16/07/2026", dow: "Jue", ph: "Lanzamiento", type: "Carrusel", obj: "Prueba social + sostener conversión",
    fmt: "Carrusel: primeras pujas y adjudicados del día 1 (autos + el primer lote nuevo)",
    hook: "Estrenamos ayer y ya hay primeros ganadores. Los lotes siguen abiertos.", cta: "Todavía puedes entrar y pujar (un solo link) #SubastasVMC",
    stories: "Repost de primeras pujas reales + countdown de lotes que cierran + link",
    justif: "Prórroga día 1. La conversión NO muere el 15: con base fría y sprint corto, buena parte del pool de retargeting recién madura ahora. No sumamos pauta nueva (seguimos en 3) — la campaña de Conversión del estreno sigue corriendo y retargetea a este público. El orgánico aporta prueba social fresca (primeras pujas reales) que baja el miedo del que ayer dudó." },
  { id: "dplus2", cd: "17/07/2026", dow: "Vie", ph: "Lanzamiento", type: "Reel", obj: "Urgencia de cierre",
    fmt: "Reel corto: recap de la semana + «cierran los lotes de apertura»",
    hook: "Última llamada: los lotes de apertura cierran hoy.", cta: "Entra antes de que cierre (un solo link) #SubastasVMC",
    stories: "Countdown de cierre por hora + «último aviso» + link",
    justif: "Prórroga día 2 y cierre del evento de apertura. Urgencia real para exprimir la cola de conversión del pool ya maduro: el que entró por el estreno y no pujó ahora tiene fecha límite. Sigue orgánico sobre la campaña de Conversión que aún corre — no es una 4ª pauta." },
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

// Los días del plan base son fijos: se editan pero no se borran. Solo los añadidos y la
// prórroga (D+1/D+2, `dplus*`) se pueden eliminar.
const BASE_IDS = new Set(DEFAULT.filter((r) => !r.id.startsWith("dplus")).map((r) => r.id));

// ponytail: derivar tipo del texto del formato cuando falta (migración v3→v4)
const guessType = (fmt = ""): string =>
  /carrusel/i.test(fmt) ? "Carrusel" : /reel|video/i.test(fmt) ? "Reel" : "Foto";

export default function MatrixEditor() {
  const [raw, persist, { saved }] = useStore<Row[]>(STORE, DEFAULT);
  const [filter, setFilter] = useState<string | null>(null);
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

  // Activar/desactivar pauta y ciclar objetivo. Se puede prender donde deba ir la campaña.
  const cycleCampaign = (id: string) =>
    persist(rows.map((r) => (r.id === id ? { ...r, campaign: nextCampaign(r.campaign) } : r)));

  // Abre un borrador: NO se persiste hasta que el usuario le da Guardar.
  const add = () => {
    setOpenId(null);
    setDraftValue({
      id: "x" + Date.now(),
      cd: "", dow: "", ph: "Despertar", type: "Foto", obj: "",
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
          <span className={s.legItem}><b>📣</b> con pauta</span>
        </span>
        <span className={`${s.saved} ${saved ? s.on : ""}`}>
          {saved ? "Guardado ✓" : "Edita cualquier texto · se guarda solo"}
        </span>
      </div>

      {/* feed real: lo último publicado va arriba-izquierda (D-DAY = nuevo VMC) */}
      <div className={s.grid}>
        {ordered.map((r) => (
          <button
            key={r.id}
            className={`${s.cell} ${s[PH_CLASS[r.ph]] || ""} ${r.dday ? s.cellDday : ""} ${r.campaign ? s.cellBoosted : ""} ${openId === r.id ? s.cellOpen : ""}`}
            onClick={() => setOpenId((o) => (o === r.id ? null : r.id))}
          >
            <span className={s.cellType} title={r.type}>{TYPE_ICON[r.type] || "▣"}</span>
            {r.campaign && <span className={s.cellCampaign} title={`Con pauta · ${r.campaign}`}>📣 {r.campaign}</span>}
            {r.folder && <span className={s.cellFolder} title="Carpeta de diseño adjunta">📁</span>}
            <span className={s.cellCd}>{r.cd}</span>
            <span className={s.cellHook}>{r.hook || <em className={s.cellEmpty}>Toca para editar</em>}</span>
            <span className={s.cellFoot}>{r.dow} · {r.type}</span>
          </button>
        ))}
      </div>

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
        const doCampaign = () => {
          if (!isDraft) return cycleCampaign(r.id);
          setDraftValue({ ...draftRef.current!, campaign: nextCampaign(draftRef.current!.campaign) });
        };
        return (
          <div className={s.modalOverlay} onClick={close}>
            <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <div className={s.modalHead}>
                <div className={s.modalTitleWrap}>
                  <Editable className={s.modalTitle} value={r.cd} onSave={(v) => setField("cd", v)} placeholder="dd/mm/aaaa" />
                  <span className={s.modalSub}>
                    <Editable className={s.modalSubEd} value={r.dow} onSave={(v) => setField("dow", v)} placeholder="Día sem." />
                  </span>
                </div>
                <button className={s.drawerClose} onClick={close} aria-label="Cerrar">✕</button>
              </div>

              <div className={s.modalTags}>
                <button className={`${s.phtag} ${s[PH_CLASS[r.ph]] || ""}`} onClick={doPhase} title="Clic: cambiar fase">{r.ph}</button>
                <button className={s.typeTag} onClick={doType} title="Clic: cambiar tipo">{TYPE_ICON[r.type]} {r.type}</button>
                <button className={`${s.campTag} ${r.campaign ? s.campOn : ""}`} onClick={doCampaign} title="Clic: activar / ciclar objetivo de pauta">{r.campaign ? `📣 ${r.campaign}` : "📣 Sin pauta"}</button>
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

              <div className={s.folderBlock}>
                <div className={s.folderHead}>
                  <span className={s.k}>📁 Carpeta de diseño · renders / fotos del día</span>
                  {r.folder && (
                    <a className={s.folderLink} href={r.folder} target="_blank" rel="noopener noreferrer">Abrir ↗</a>
                  )}
                </div>
                <Editable className={s.edit} value={r.folder || ""} onSave={(v) => setField("folder", v)} placeholder="Pega el enlace a Drive / carpeta de diseño…" />
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
