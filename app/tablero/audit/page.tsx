import Link from "next/link";
import s from "../page.module.css";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const FUNCIONA = [
  ["Reels con historia", "Cuando el reel cuenta algo (no solo muestra el auto), la gente se queda y comenta. Es lo único que te saca del círculo de seguidores dormidos."],
  ["Contenido que enseña", "Los tips y el «cómo funciona» se guardan, y el guardado pesa más que el like para que Instagram te reparta a gente nueva."],
  ["Autos con gancho", "El mismo auto, pero con un titular que pica («este SUV salió a menos de X»), rinde mucho más que la ficha fría."],
];
const FRENA = [
  ["Leads de compra sin responder", "Los comentarios están abiertos y llegan preguntas de compra («¿con quién me comunico?») que quedan sin respuesta. El canal funciona; el dinero se queda sobre la mesa por no responder ni capturar el lead."],
  ["Publicar sin preguntar", "5,597 posts y 3-5 likes. El problema no es publicar de más, es publicar sin pedir una sola interacción."],
  ["5 links en la bio", "«y 4 más» reparte la intención en cinco destinos. Nadie hace clic en cinco cosas. Uno solo, medible."],
  ["Ficha de auto sin alma", "El carrusel catálogo de partner llena el feed y no mueve a nadie. El producto está; falta el gancho."],
];

const PILARES = [
  ["🔨", "Subastas en vivo", "Autos como base diaria y ahora todo tipo de lotes: el producto en acción cada día."],
  ["🎓", "Educación y confianza", "Cómo funciona, tips para ofertar, transparencia."],
  ["🏆", "Prueba social", "Ganadores, testimonios, autos entregados."],
  ["🎥", "Marca y comunidad", "Detrás de cámara, equipo, cultura VMC."],
];

const CADENCIA = [
  {
    q: "¿Publicamos todos los días?",
    a: ["Sí, y eso no se discute. Los autos a subasta salen a diario: son el inventario, el negocio, y cada auto es una venta posible. Cortarlos para «no saturar» sería dispararnos al pie.",
        "Lo que cambia no es la frecuencia, es la señal. Los comentarios ya están activos y por ahí entran leads con intención de compra — pero muchos posts salen sin una sola pregunta y hay preguntas de compra sin responder. La regla de la semana: <b>los autos siguen a diario (un gancho + responder cada comentario de compra)</b>, y encima montamos el post héroe de campaña."],
  },
  {
    q: "¿Qué día salen los videos? ¿1 o 2 Reels por semana?",
    a: ["En modo normal, <b>2 Reels/semana</b> es lo sostenible para un equipo chico y suficiente para que el algoritmo te muestre a no-seguidores. Esta semana es excepción: Reel en los 2 momentos que mueven la aguja: el <b>reveal (lunes, D-2)</b> y el <b>lanzamiento (miércoles, D-Day)</b>.",
        "¿Por qué no un Reel cada día? Porque 7 Reels en 7 días con este equipo = 7 Reels mediocres, y un video que no retiene le enseña al algoritmo que tu contenido no vale. Mejor 2 que la rompan que 7 que pasen sin pena ni gloria."],
  },
  {
    q: "¿Por qué este orden y no otro?",
    a: ["Empezamos con valor y confianza, no con «compra ya». La cuenta está fría: pedir conversión a una audiencia que no interactúa hace meses es como pedir matrimonio en la primera cita. Primero reabrimos conversación, damos valor y generamos confianza, y <b>recién entonces</b> revelamos y convertimos."],
  },
  {
    q: "¿Y los 112 K seguidores?",
    a: ["No asumamos que verán el lanzamiento. Son 6 años de base acumulada, buena parte inactiva o que el algoritmo ya no alcanza. El público real de la semana 1 sale de los <b>Reels</b> (alcance nuevo), la <b>reactivación de comentarios</b> (despertar a los tibios) y, si hace falta, algo de <b>pauta</b>. Creer que «112 K van a ver el reveal» es el error más caro."],
  },
];

export const metadata = { title: "Audit VMC · @vmcsubastas" };

export default function Audit() {
  return (
    <div className={s.root}>
      <div className={s.topbar}>
        <Link href="/tablero">Plan</Link>
        <Link href="/tablero/audit" className={s.navActive}>Audit VMC</Link>
        <span className={s.muted}>Subastop · plan de contenido</span>
      </div>

      <div className={s.wrap}>
        <header className={s.hero}>
          <div>
            <div className={s.brandChip}><span className={s.dot} /> Audit · <b>@vmcsubastas</b></div>
            <h1>Audit VMC<br /><span className={s.grad}>el porqué detrás de la grilla</span></h1>
            <p className={s.thesis}>
              Qué suma y qué corregir ya, la <b>optimización de perfil</b> lista para copiar y pegar,
              y la <b>lógica de cadencia</b> que justifica el orden del feed.
            </p>
          </div>
        </header>

        <h2 className={s.sec}><span className={s.n}>01</span> Auditoría del perfil <span className={s.hint}>qué suma y qué corregir ya</span></h2>
        <div className={s.cols2}>
          <div className={cx(s.panel, s.good)}>
            <p className={s.panelHead}>✓ Lo que sí funciona</p>
            <ul className={s.plist}>
              {FUNCIONA.map(([t, d]) => (<li key={t}><span>+</span><span><b>{t}.</b> {d}</span></li>))}
            </ul>
          </div>
          <div className={cx(s.panel, s.bad)}>
            <p className={s.panelHead}>✕ Lo que te está frenando</p>
            <ul className={s.plist}>
              {FRENA.map(([t, d]) => (<li key={t}><span>–</span><span><b>{t}.</b> {d}</span></li>))}
            </ul>
          </div>
        </div>

        <h2 className={s.sec}><span className={s.n}>02</span> Cómo pensamos la cadencia</h2>
        <div className={s.qa}>
          {CADENCIA.map((item) => (
            <div key={item.q} className={s.qitem}>
              <p className={s.q}>{item.q}</p>
              {item.a.map((p, i) => (
                <p key={i} className={s.a} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
          ))}
        </div>

        <h2 className={s.sec}><span className={s.n}>03</span> Después del lanzamiento <span className={s.hint}>gestión continua, alineada con la agencia</span></h2>
        <div className={s.pillars}>
          {PILARES.map(([ic, t, d]) => (
            <div key={t} className={s.pillar}>
              <div className={s.ic}>{ic}</div>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <div className={s.rhythm}>
          <h4>Cadencia sostenible</h4>
          <p><b>Autos a subasta a diario (la base) + 2-3 piezas de marca/valor por semana + Stories diario.</b> Rotando los 4 pilares. Siempre comentarios activados y un solo CTA/destino medible.</p>
          <p><b>Alineación con la agencia:</b> nosotros llevamos orgánico y comunidad; la agencia lleva pauta y performance, sobre el mismo link con seguimiento. Sync semanal y reporte mensual (alcance, guardados, comentarios, clics a la lista, registros).</p>
        </div>

        <footer className={s.footer}>Audit VMC · @vmcsubastas · presentación 08 jul · lanzamiento 15 jul 2026</footer>
      </div>
    </div>
  );
}
