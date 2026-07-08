import Link from "next/link";
import s from "./page.module.css";

const cx = (...c) => c.filter(Boolean).join(" ");

// ── Datos ──────────────────────────────────────────────────────────────
// real = confirmado por la auditoría. muestra = placeholder para conectar la API de IG.
const KPIS = [
  { k: "Seguidores", v: "112,340", trend: "+0.3%", dir: "up", src: "real" },
  { k: "Engagement", v: "0.004%", trend: "crítico", dir: "down", src: "real" },
  { k: "Alcance 30d", v: "48,200", trend: "+12%", dir: "up", src: "muestra" },
  { k: "Publicaciones", v: "5,597", trend: "histórico", dir: "flat", src: "real" },
];

// interacciones por día (últimos 14) — muestra
const SERIE = [5, 4, 6, 3, 5, 7, 4, 6, 5, 8, 6, 4, 7, 9];

// mejores horas (muestra): filas franja horaria × columnas día
const FRANJAS = ["Mañana", "Tarde", "Noche"];
const DIAS = ["L", "M", "X", "J", "V", "S", "D"];
const HEAT = [
  [1, 1, 2, 1, 2, 3, 2],
  [2, 2, 3, 2, 3, 3, 2],
  [1, 2, 2, 3, 3, 2, 1],
];
const HEAT_OP = [0.05, 0.3, 0.58, 0.92];

const FORMATOS = [
  { t: "Reels", pct: 62 },
  { t: "Carruseles", pct: 28 },
  { t: "Posts simples", pct: 10 },
];

const PERF = [
  { fmt: "reel", label: "Reel", tema: "«El motor que nunca falla»", likes: 41, com: 9, save: 22, alc: 3800, best: true },
  { fmt: "carrusel", label: "Carrusel", tema: "3 errores al ofertar", likes: 18, com: 4, save: 14, alc: 1600 },
  { fmt: "post", label: "Post", tema: "Ficha auto — Toyota Yaris", likes: 5, com: 0, save: 1, alc: 420 },
  { fmt: "post", label: "Post", tema: "Ficha auto — Hyundai Tucson", likes: 4, com: 0, save: 2, alc: 380 },
  { fmt: "reel", label: "Reel", tema: "Recorrido subasta en vivo", likes: 27, com: 6, save: 11, alc: 2400 },
];

// ── Gráfico de tendencia (SVG) ─────────────────────────────────────────
function trendPaths(data, W = 720, H = 180, P = 18) {
  const max = Math.max(...data);
  const xs = data.map((_, i) => P + (i * (W - 2 * P)) / (data.length - 1));
  const ys = data.map((v) => H - P - (v / max) * (H - 2 * P));
  const line = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");
  const area = `${line} L${xs[xs.length - 1].toFixed(1)} ${H - P} L${xs[0].toFixed(1)} ${H - P} Z`;
  const grid = [0, 0.5, 1].map((f) => H - P - f * (H - 2 * P));
  return { line, area, grid, end: { x: xs[xs.length - 1], y: ys[ys.length - 1] }, W, H };
}

export const metadata = { title: "Panel de métricas · @vmcsubastas" };

export default function Metricas() {
  const c = trendPaths(SERIE);
  return (
    <div className={s.root}>
      <div className={s.topbar}>
        <Link href="/tablero">Plan</Link>
        <Link href="/metricas" className={s.active}>Métricas</Link>
        <span className={s.muted}>Subastop · @vmcsubastas</span>
      </div>

      <div className={s.wrap}>
        <div className={s.hero}>
          <div>
            <div className={s.brandChip}><span className={s.dot} /> Panel de métricas</div>
            <h1>Cómo se está <span className={s.grad}>moviendo la cuenta</span></h1>
          </div>
          <div className={s.rangeSel}>
            <span>7d</span><span className="on">30d</span><span>90d</span>
          </div>
        </div>

        <div className={s.sample}>
          <span>📊</span>
          <div><b>Datos de muestra.</b> Los KPIs marcados «real» vienen de la auditoría; el resto es placeholder. Para métricas en vivo hay que conectar la API de Instagram (Graph API · Insights).</div>
        </div>

        <div className={s.kpis}>
          {KPIS.map((m) => (
            <div key={m.k} className={s.kpi}>
              <div className={s.k}>{m.k}</div>
              <div className={s.v}>{m.v}</div>
              <div className={s.foot}>
                <span className={cx(s.trend, s[m.dir])}>{m.trend}</span>
                <span className={cx(s.tagReal, m.src === "real" ? s.real : s.mock)}>{m.src}</span>
              </div>
            </div>
          ))}
        </div>

        <h2 className={s.sec}>Tendencia de interacción <span className={s.hint}>últimos 14 días · interacciones por día</span></h2>
        <div className={s.card}>
          <div className={s.cardHead}>
            <span className={s.t}>Interacciones diarias</span>
            <span className={s.s}>muestra</span>
          </div>
          <svg className={s.chart} viewBox={`0 0 ${c.W} ${c.H}`} preserveAspectRatio="none" role="img" aria-label="Tendencia de interacciones">
            <defs>
              <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ed8936" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#8460e5" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {c.grid.map((y, i) => (
              <line key={i} className={s.grid} x1="18" y1={y} x2={c.W - 18} y2={y} />
            ))}
            <path className={s.area} d={c.area} />
            <path className={s.line} d={c.line} />
            <circle className={s.end} cx={c.end.x} cy={c.end.y} r="5" />
          </svg>
        </div>

        <div className={s.row2} style={{ marginTop: 14 }}>
          <div className={s.card}>
            <div className={s.cardHead}>
              <span className={s.t}>Mejores horas para publicar</span>
              <span className={s.s}>muestra</span>
            </div>
            <div className={s.heat}>
              <div className={s.hd} />
              {DIAS.map((d) => <div key={d} className={s.hd}>{d}</div>)}
              {FRANJAS.map((fr, ri) => (
                <FranjaRow key={fr} label={fr} row={HEAT[ri]} />
              ))}
            </div>
            <div className={s.heatLegend}>
              menos
              {HEAT_OP.map((op, i) => (
                <span key={i} className={s.sw} style={{ backgroundColor: `rgba(237,137,54,${op})` }} />
              ))}
              más
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHead}>
              <span className={s.t}>Mix de formatos</span>
              <span className={s.s}>% del engagement</span>
            </div>
            <div className={s.bars}>
              {FORMATOS.map((f) => (
                <div key={f.t} className={s.bar}>
                  <div className={s.top}><span>{f.t}</span><b>{f.pct}%</b></div>
                  <div className={s.track}><div className={s.fill} style={{ width: `${f.pct}%` }} /></div>
                </div>
              ))}
            </div>
            <p style={{ margin: "14px 0 0", fontSize: 12.5, color: "var(--ink-soft)" }}>
              Los Reels concentran el engagement pese a ser minoría del feed. Ahí está la palanca.
            </p>
          </div>
        </div>

        <h2 className={s.sec}>Rendimiento por publicación <span className={s.hint}>muestra · ordenable al conectar la API</span></h2>
        <div className={s.card} style={{ padding: 16 }}>
          <div className={s.tableWrap}>
            <table className={s.perf}>
              <thead>
                <tr>
                  <th>Formato</th><th>Tema</th><th>Likes</th><th>Coment.</th><th>Guardados</th><th>Alcance</th>
                </tr>
              </thead>
              <tbody>
                {PERF.map((p, i) => (
                  <tr key={i} className={p.best ? s.best : ""}>
                    <td><span className={cx(s.fmt, s[p.fmt])}>{p.label}</span></td>
                    <td>{p.tema}</td>
                    <td>{p.likes}</td>
                    <td>{p.com}</td>
                    <td>{p.save}</td>
                    <td>{p.alc.toLocaleString("es-PE")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className={s.footer}>Panel de métricas · @vmcsubastas · datos de muestra hasta conectar la API de Instagram</footer>
      </div>
    </div>
  );
}

function FranjaRow({ label, row }) {
  return (
    <>
      <div className={s.rl}>{label}</div>
      {row.map((val, i) => (
        <div key={i} className={s.cell} style={{ backgroundColor: `rgba(237,137,54,${HEAT_OP[val]})` }} />
      ))}
    </>
  );
}
