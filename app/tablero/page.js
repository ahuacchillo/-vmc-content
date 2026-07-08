import s from "./page.module.css";
import MatrixEditor from "./MatrixEditor";
import CopyBlock from "./CopyBlock";

const cx = (...c) => c.filter(Boolean).join(" ");

// Auditoría (base: análisis de @vmcsubastas, verificar en vivo antes de presentar)
const FUNCIONA = [
  ["Reels con historia", "Cuando el reel cuenta algo (no solo muestra el auto), la gente se queda y comenta. Es lo único que te saca del círculo de seguidores dormidos."],
  ["Contenido que enseña", "Los tips y el «cómo funciona» se guardan, y el guardado pesa más que el like para que Instagram te reparta a gente nueva."],
  ["Autos con gancho", "El mismo auto, pero con un titular que pica («este SUV salió a menos de X»), rinde mucho más que la ficha fría."],
];
const FRENA = [
  ["Comentarios apagados", "Es autosabotaje: le quitas al algoritmo la señal que más usa para repartir, y al visitante nuevo la prueba social que necesita para confiar."],
  ["Publicar sin preguntar", "5,597 posts y 3-5 likes. El problema no es publicar de más, es publicar sin pedir una sola interacción."],
  ["5 links en la bio", "«y 4 más» reparte la intención en cinco destinos. Nadie hace clic en cinco cosas. Uno solo, medible."],
  ["Ficha de auto sin alma", "El carrusel catálogo de partner llena el feed y no mueve a nadie. El producto está; falta el gancho."],
];

const PILARES = [
  ["🔨", "Subastas en vivo", "Autos y ofertas reales, el producto en acción todos los días."],
  ["🎓", "Educación y confianza", "Cómo funciona, tips para ofertar, transparencia."],
  ["🏆", "Prueba social", "Ganadores, testimonios, autos entregados."],
  ["🎥", "Marca y comunidad", "Detrás de cámara, equipo, cultura VMC."],
];

const CADENCIA = [
  {
    q: "¿Publicamos todos los días?",
    a: ["Sí, y eso no se discute. Los autos a subasta salen a diario: son el inventario, el negocio, y cada auto es una venta posible. Cortarlos para «no saturar» sería dispararnos al pie.",
        "Lo que cambia no es la frecuencia, es la señal. Hoy esos posts van con comentarios apagados y sin una sola pregunta. La regla de la semana: <b>los autos siguen a diario (comentarios ON + un gancho)</b>, y encima montamos el post héroe de campaña."],
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

export const metadata = { title: "Plan de lanzamiento · @vmcsubastas" };

export default function Tablero() {
  return (
    <div className={s.root}>
      <div className={s.topbar}>
        <span className={s.muted}>Subastop · plan de contenido</span>
      </div>

      <div className={s.wrap}>
        <header className={s.hero}>
          <div>
            <div className={s.brandChip}><span className={s.dot} /> Relanzamiento · <b>@vmcsubastas</b></div>
            <h1>Plan de lanzamiento<br /><span className={s.grad}>rumbo al 15 de julio</span></h1>
            <p className={s.thesis}>
              Los <b>autos a subasta</b> se siguen publicando a diario, son el negocio. El problema no es cuánto
              publicamos: es que esa frecuencia va con <b>comentarios apagados y sin gancho</b>, y no genera señal.
              El plan <b>mantiene el ritmo diario, lo activa</b>, y le suma la narrativa de lanzamiento hasta el 15/7.
            </p>
          </div>
          <div className={s.launch}>
            <div className={s.lab}>Lanzamiento</div>
            <div className={s.day}>15</div>
            <div className={s.mo}>Jul · Mié</div>
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
        <p className={s.note}>* Basado en la auditoría previa de la cuenta. No pude leer el perfil en vivo desde aquí, conviene una mirada rápida antes de presentar, por si los números cambiaron.</p>

        <h2 className={s.sec}><span className={s.n}>02</span> Optimización de perfil <span className={s.hint}>listo para copiar y pegar</span></h2>
        <div className={s.optStack}>
          <CopyBlock label="Nombre (campo buscable)" text="VMC Subastas · Subasta de autos Perú 🚗" />
          <CopyBlock
            label="Bio"
            text={"🚗 Compra y vende autos en subasta, directo de financieras y aseguradoras.\n🔥 Algo nuevo llega el 15 de julio.\n👇 Únete a la lista de espera"}
          />
          <CopyBlock
            label="CTA · un solo enlace"
            text={"Enlace en bio (uno solo): [tu-link-de-lista-de-espera]\nTexto del botón / sticker: «Únete a la lista de espera»\nEn Stories: link sticker → misma URL"}
          />
        </div>
        <p className={s.note}>Nombre = campo buscable: mételo con las palabras que la gente busca («subasta de autos Perú»). Regla de oro: <b>un solo destino</b>, no cinco.</p>

        <h2 className={s.sec}><span className={s.n}>03</span> Cómo pensamos la cadencia</h2>
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

        <h2 className={s.sec}><span className={s.n}>04</span> Matriz 7 días <span className={s.hint}>editable · filtra por fase · se guarda solo</span></h2>
        <MatrixEditor />

        <h2 className={s.sec}><span className={s.n}>05</span> Después del lanzamiento <span className={s.hint}>gestión continua, alineada con la agencia</span></h2>
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

        <footer className={s.footer}>Plan de lanzamiento · @vmcsubastas · presentación 08 jul · lanzamiento 15 jul 2026</footer>
      </div>
    </div>
  );
}
