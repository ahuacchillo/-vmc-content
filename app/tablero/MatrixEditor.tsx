"use client";
import { useRef, useState } from "react";
import s from "./page.module.css";
import { useStore } from "./useStore";

const STORE = "vmc-matriz-v7";
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
  id: string; cd: string; date: string; dow: string; ph: string; type: string;
  obj: string; fmt: string; hook: string; cta: string; stories: string; justif: string;
  dday?: boolean; campaign?: string; // objetivo de pauta; undefined = orgánico
};

// Base: análisis de growth @vmcsubastas (D-7 → D-Day, 7/8→7/15). Ángulo confirmado:
// sigue siendo VMC (NO cambio de nombre), pero el REVEAL es la expansión de categoría.
// EJE DE CAMPAÑA: "Todo se remata" + #TodoSeRemata (variedad inequívoca; NO "Con Todo",
// que la audiencia ya lee como actitud/empuje, no como surtido). "Ya no solo autos" =
// la pieza que nombra el cambio de frente (D-5). 4 verticales de apoyo: 🚗 Autos ·
// 📱 Tech · 🛋️ Muebles · 🏠 Inmuebles. Autos = ancla/base diaria y prueba de credibilidad;
// la expansión es la noticia que le da peso al 15/7. Reassurance a la base: "los autos
// no se van, solo tienen vecinos".
// La base diaria de autos a subasta NO está aquí: sigue todos los días. Esto es la capa "héroe".
// Arranca el viernes 10 (D-5): los días previos (7/8-7/9) ya pasaron. Corre hasta D+2 (Vie 17):
// la prórroga post-lanzamiento donde la conversión del pool ya maduro se sigue exprimiendo.
// Pauta reducida a 3 (reglas): D-5 Alcance (siembra pool) · D-2 Alcance (reveal) · D-Day Conversión.
const DEFAULT: Row[] = [
  { id: "d5", cd: "D-5", date: "7/10", dow: "Vie", ph: "Despertar", type: "Reel", campaign: "Alcance", obj: "Abrir conversación + nombrar el cambio",
    fmt: "Reel: «Empezamos con autos… mira hasta dónde llegamos» (2020 → hoy)",
    hook: "Ya no solo autos. Empezamos ahí — no terminamos ahí.", cta: "¿Qué te gustaría rematar? Tíralo abajo — respondemos TODO #TodoSeRemata",
    stories: "Poll «¿qué subastarías?» + sticker de pregunta + repost de respuestas (reactivar comentarios)",
    justif: "PRIMERA pieza del sprint corto (arrancamos Vie 10, sin días de teaser previos): carga doble. (1) Nombra el cambio de frente («Ya no solo autos»), que sobre 6 años de autos se siente evolución, no ruptura. (2) Asume la REACTIVACIÓN que hacía el viejo D-7: la cuenta está fría y sin señal el algoritmo no empuja el reveal — por eso la pregunta + responder cada comentario desde hoy es no negociable. Estrena #TodoSeRemata (UGC «¿y esto se remata?») y su pauta de Alcance arranca el pool de retargeting desde el día 1." },
  { id: "d4", cd: "D-4", date: "7/11", dow: "Sáb", ph: "Hype", type: "Reel", obj: "Enseñar la mecánica / mostrar el upgrade",
    fmt: "Reel screen-record: la misma puja sobre un auto y sobre un lote nuevo (tech), lado a lado",
    hook: "Cómo pujar en 30 segundos: si sabes rematar un auto, ya sabes rematar todo.", cta: "Guárdalo — te va a servir el 15/7",
    stories: "«Antes vs. Ahora» de la interfaz + countdown",
    justif: "Auditoría: la mecánica hoy es invisible en el perfil. Activo educativo #1 — muestra el upgrade en vez de prometerlo, y se guarda al highlight «CÓMO PUJAR». En el plan corto ABSORBE el trabajo del carrusel de valor que perdimos (D-6): el ángulo «cómo pujar en 30s» es guardable, y el guardado es la señal más barata para alcance frío nuevo. Clave del reveal: el flujo es idéntico para un auto o un lote nuevo, nadie reaprende nada. Para 112K que ya confían, mostrar convierte más que intrigar." },
  { id: "d3", cd: "D-3", date: "7/12", dow: "Dom", ph: "Hype", type: "Carrusel", obj: "Prueba social + FOMO",
    fmt: "Carrusel: ganadores reales de estos años + «ahora será aún más fácil»",
    hook: "Miles ya se llevaron su auto acá. Sin comisiones, sin intermediarios. Y esto recién se pone bueno.", cta: "Regístrate en la lista HOY — los lotes de apertura son limitados (un solo link) #TodoSeRemata",
    stories: "Repost de clips de ganadores + countdown «faltan 2 días» + link a la lista",
    justif: "Auditoría: falta prueba social. Los ganadores reales puentean la confianza de los 6 años hacia la plataforma nueva. En el plan corto el pool de retargeting tuvo menos tiempo para crecer, así que aquí ENDURECEMOS el pedido de registro (antes era conversión «suave»): CTA directo a la lista con escasez real (lotes de apertura limitados), sin quemar el reveal del D-2." },
  { id: "d2", cd: "D-2", date: "7/13", dow: "Lun", ph: "Reveal", type: "Reel", campaign: "Alcance", obj: "Reveal total",
    fmt: "Reel + Carrusel oficial · abre con un auto, luego tech · muebles · inmuebles",
    hook: "Seguimos siendo VMC. Y ahora TODO SE REMATA: autos, tech, muebles, inmuebles.", cta: "El 15/7 abre todo. Regístrate hoy y entra primero. #TodoSeRemata",
    stories: "Countdown + sneak peek de las 4 categorías + link · cierre «#TodoSeRemata»",
    justif: "EL REVEAL. Va HOY, no el día del lanzamiento, a propósito: 48 h para circular y generar comentarios antes de pedir registro. Dos mensajes fusionados: «sigue siendo VMC» (calma a los 112 K, no es cambio de marca) + «TODO SE REMATA» (la noticia real, variedad inequívoca, ya con las 4 categorías). Reassurance directa a la base: «los autos no se van — ahora tienen vecinos». Abrir con un auto para que lo primero que vean siga siendo casa. Reel para alcance frío; carrusel para la base." },
  { id: "d1", cd: "D-1", date: "7/14", dow: "Mar", ph: "Reveal", type: "Reel", obj: "Urgencia",
    fmt: "Reel + Stories: preview de lotes de apertura — un auto + un lote de cada categoría nueva (precios teaser)",
    hook: "Mañana abren los lotes. Y ojo: no todos tienen 4 ruedas.", cta: "Activa el recordatorio para mañana 9 a.m.",
    stories: "Countdown cada pocas horas + «Activa notificaciones» + AMA opcional",
    justif: "Víspera. Todo el peso a recordatorios en Stories. El preview mezcla auto + tech + mueble + inmueble para PROBAR que «todo se remata» es real, no promesa. No competimos con nosotros mismos con un feed fuerte hoy. El escenario es de mañana." },
  { id: "dday", cd: "D-DAY", date: "7/15", dow: "Mié", ph: "Lanzamiento", type: "Reel", dday: true, campaign: "Conversión", obj: "Conversión",
    fmt: "Reel FIJADO + Carrusel catálogo (slide 1 = auto fuerte, luego un lote por categoría) + flood de Stories",
    hook: "Ya está abierto. Todo se remata: autos, tech, muebles, inmuebles. Haz tu primera oferta.", cta: "Regístrate y oferta hoy (un solo link) #TodoSeRemata",
    stories: "Flood de Stories por categoría + link stickers + guardar a highlight «NUEVO 🔨» + Live opcional",
    justif: "Día D. Reel fijado + un solo CTA medible. El carrusel-catálogo abre con un auto (tranquiliza a la base) y recién ahí rota por tech/muebles/inmuebles. Lo decisivo: responder cada comentario en la 1ª hora. Eso es lo que hace que el algoritmo empuje el lanzamiento a más gente." },
  { id: "dplus1", cd: "D+1", date: "7/16", dow: "Jue", ph: "Lanzamiento", type: "Carrusel", obj: "Prueba social + sostener conversión",
    fmt: "Carrusel: primeras pujas y adjudicados del día 1 (autos + un lote nuevo)",
    hook: "Abrimos ayer y ya hay primeros ganadores. Los lotes siguen abiertos.", cta: "Todavía puedes entrar y pujar (un solo link) #TodoSeRemata",
    stories: "Repost de primeras pujas reales + countdown de lotes que cierran + link",
    justif: "Prórroga día 1. La conversión NO muere el 15: con base fría y sprint corto, buena parte del pool de retargeting recién madura ahora. No sumamos pauta nueva (seguimos en 3) — la campaña de Conversión del D-Day sigue corriendo y retargetea a este público. El orgánico aporta prueba social fresca (primeras pujas reales) que baja el miedo del que ayer dudó." },
  { id: "dplus2", cd: "D+2", date: "7/17", dow: "Vie", ph: "Lanzamiento", type: "Reel", obj: "Urgencia de cierre",
    fmt: "Reel corto: recap de la semana + «cierran los lotes de apertura»",
    hook: "Última llamada: los lotes de apertura cierran hoy.", cta: "Entra antes de que cierre (un solo link) #TodoSeRemata",
    stories: "Countdown de cierre por hora + «último aviso» + link",
    justif: "Prórroga día 2 y cierre del evento de apertura. Urgencia real para exprimir la cola de conversión del pool ya maduro: el que entró por el reveal y no pujó ahora tiene fecha límite. Sigue orgánico sobre la campaña de Conversión que aún corre — no es una 4ª pauta." },
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
            <span className={s.cellCd}>{r.cd}</span>
            <span className={s.cellHook}>{r.hook || <em className={s.cellEmpty}>Toca para editar</em>}</span>
            <span className={s.cellFoot}>{r.dow} {r.date} · {r.type}</span>
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
